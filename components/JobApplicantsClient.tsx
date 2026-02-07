"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/client';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/button-saas';
import { Card, CardContent } from '@/components/card-saas';

interface Applicant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume_url: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface JobApplicantsClientProps {
  jobId: string;
  jobTitle: string;
}

const getStatusConfig = (status: string) => {
  const configs: Record<string, any> = {
    accepted: {
      bg: 'bg-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-500/20',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    rejected: {
      bg: 'bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-500/20',
      icon: <XCircle className="w-4 h-4" />,
    },
    pending: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
      icon: <Clock className="w-4 h-4" />,
    },
    interviewing: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/20',
      icon: <Briefcase className="w-4 h-4" />,
    },
  };
  return configs[status] || configs.pending;
};

const StatsCard = ({ label, count, icon, active }: {
  label: string;
  count: number;
  icon: React.ReactNode;
  active: boolean;
}) => (
  <Card className={`cursor-pointer transition-all duration-200 ${
    active 
      ? 'bg-primary/10 border-primary shadow-lg' 
      : 'bg-card border-border hover:shadow-md'
  }`}>
    <CardContent className="pt-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${active ? 'text-primary' : 'text-foreground'}`}>
            {count}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function JobApplicantsClient({ jobId, jobTitle }: JobApplicantsClientProps) {
  const supabase = createClient();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplicants();
    
    const channel = supabase
      .channel('applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchApplicants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  async function fetchApplicants() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (data) setApplicants(data);
    setLoading(false);
  }

  async function updateStatus(applicantId: string, newStatus: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', applicantId)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        toast.error(`Failed to update: ${error.message}`);
        return;
      }

      if (data) {
        setApplicants(prev => 
          prev.map(app => app.id === applicantId ? { ...app, status: newStatus } : app)
        );
        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
        }
        toast.success(`Application ${newStatus}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  }

  const filteredApplicants = applicants.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  const stats = {
    all: applicants.length,
    pending: applicants.filter(a => a.status === 'pending').length,
    accepted: applicants.filter(a => a.status === 'accepted').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-foreground font-medium">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Applicants for {jobTitle}
          </h1>
          <p className="text-lg text-muted-foreground">
            {applicants.length} total applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div onClick={() => setFilter('all')}>
            <StatsCard
              label="All"
              count={stats.all}
              icon={<Users className="w-5 h-5 text-primary" />}
              active={filter === 'all'}
            />
          </div>
          <div onClick={() => setFilter('pending')}>
            <StatsCard
              label="Pending"
              count={stats.pending}
              icon={<Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              active={filter === 'pending'}
            />
          </div>
          <div onClick={() => setFilter('accepted')}>
            <StatsCard
              label="Accepted"
              count={stats.accepted}
              icon={<CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
              active={filter === 'accepted'}
            />
          </div>
          <div onClick={() => setFilter('rejected')}>
            <StatsCard
              label="Rejected"
              count={stats.rejected}
              icon={<XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
              active={filter === 'rejected'}
            />
          </div>
        </div>

        {filteredApplicants.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No applicants found
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applicants List */}
            <div className="lg:col-span-1 space-y-3">
              {filteredApplicants.map((applicant) => {
                const config = getStatusConfig(applicant.status);
                return (
                  <Card
                    key={applicant.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedApplicant?.id === applicant.id
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'bg-card border-border hover:shadow-md'
                    }`}
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-foreground">
                          {applicant.full_name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full ${config.bg} ${config.text} ${config.border} border`}>
                          {config.icon}
                          {applicant.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 truncate">{applicant.email}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(applicant.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Applicant Details */}
            <div className="lg:col-span-2">
              {selectedApplicant ? (
                <Card className="bg-card border-border">
                  <CardContent className="pt-8 pb-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
                      <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                          {selectedApplicant.full_name}
                        </h2>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${selectedApplicant.email}`} className="hover:text-primary transition-colors">
                              {selectedApplicant.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${selectedApplicant.phone}`} className="hover:text-primary transition-colors">
                              {selectedApplicant.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                      {(() => {
                        const config = getStatusConfig(selectedApplicant.status);
                        return (
                          <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl ${config.bg} ${config.text} ${config.border} border`}>
                            {config.icon}
                            {selectedApplicant.status}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="space-y-8">
                      {/* Resume */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                            Resume
                          </h3>
                        </div>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => window.open(selectedApplicant.resume_url, '_blank')}
                        >
                          View Resume
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Cover Letter */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                            Cover Letter
                          </h3>
                        </div>
                        <div className="bg-secondary/30 rounded-xl p-6 border border-border">
                          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                            {selectedApplicant.cover_letter}
                          </p>
                        </div>
                      </div>

                      {/* Status Update Actions */}
                      <div>
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">
                          Update Status
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Button
                            variant="success"
                            size="lg"
                            onClick={() => updateStatus(selectedApplicant.id, 'accepted')}
                            disabled={selectedApplicant.status === 'accepted'}
                            className="w-full"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Accept
                          </Button>
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={() => updateStatus(selectedApplicant.id, 'pending')}
                            disabled={selectedApplicant.status === 'pending'}
                            className="w-full"
                          >
                            <Clock className="w-4 h-4" />
                            Pending
                          </Button>
                          <Button
                            variant="destructive"
                            size="lg"
                            onClick={() => updateStatus(selectedApplicant.id, 'rejected')}
                            disabled={selectedApplicant.status === 'rejected'}
                            className="w-full"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border border-dashed">
                  <CardContent className="py-16 text-center">
                    <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select an applicant to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}