"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/client';
import { toast } from 'sonner';

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

export default function JobApplicantsClient({ jobId, jobTitle }: JobApplicantsClientProps) {
  const supabase = createClient();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplicants();
    
    // Set up real-time subscription
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const filteredApplicants = applicants.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-heading font-medium">Loading applicants...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-24 pb-4">
      <div className="mb-6">
        <Link href="/dashboard" className="text-primary-600 hover:underline text-sm mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-heading dark:text-white">
          Applicants for {jobTitle}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {applicants.length} total applications
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary-600 text-white' 
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All ({applicants.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Pending ({applicants.filter(a => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'accepted'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Accepted ({applicants.filter(a => a.status === 'accepted').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'rejected'
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Rejected ({applicants.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {filteredApplicants.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No applicants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {filteredApplicants.map((applicant) => (
              <button
                key={applicant.id}
                onClick={() => setSelectedApplicant(applicant)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedApplicant?.id === applicant.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-heading dark:text-white">
                    {applicant.full_name}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                    {applicant.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{applicant.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Applied {new Date(applicant.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedApplicant ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-heading dark:text-white mb-1">
                      {selectedApplicant.full_name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplicant.email}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplicant.phone}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedApplicant.status)}`}>
                    {selectedApplicant.status}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-heading dark:text-white mb-2 uppercase tracking-wide">
                      Resume
                    </h3>
                    <a
                      href={selectedApplicant.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:underline"
                    >
                      View Resume →
                    </a>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-heading dark:text-white mb-2 uppercase tracking-wide">
                      Cover Letter
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedApplicant.cover_letter}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-heading dark:text-white mb-3 uppercase tracking-wide">
                      Update Status
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus(selectedApplicant.id, 'accepted')}
                        disabled={selectedApplicant.status === 'accepted'}
                        className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApplicant.id, 'pending')}
                        disabled={selectedApplicant.status === 'pending'}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApplicant.id, 'rejected')}
                        disabled={selectedApplicant.status === 'rejected'}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Select an applicant to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}