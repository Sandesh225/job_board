"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  job_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  jobs: {
    title: string;
    company: string;
    location: string;
    job_type: string;
    experience_level: string;
    salary: string | null;
  };
}

interface MyApplicationsClientProps {
  applications: Application[];
}

// Status Tracker Component
function ApplicationStatusTracker({ 
  status, 
  appliedDate,
  viewedDate 
}: { 
  status: string; 
  appliedDate: string;
  viewedDate?: string | null;
}) {
  
  const statuses = [
    { key: 'pending', label: 'Applied', icon: '📝' },
    { key: 'viewed', label: 'Viewed', icon: '👀' },
    { key: 'shortlisted', label: 'Shortlisted', icon: '⭐' },
    { key: 'interviewing', label: 'Interview', icon: '💼' },
    { key: 'accepted', label: 'Accepted', icon: '✅' },
    { key: 'rejected', label: 'Rejected', icon: '❌' },
  ];

  const getCurrentIndex = () => {
    const index = statuses.findIndex(s => s.key === status);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getCurrentIndex();
  const isRejected = status === 'rejected';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Application Progress
      </h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700">
          <div 
            className={`h-full transition-all duration-500 ${
              isRejected ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          />
        </div>

        {/* Status Points */}
        <div className="relative flex justify-between">
          {statuses.map((s, idx) => {
            const isActive = idx <= currentIndex;
            const isCurrent = s.key === status;
            
            // Don't show rejected in normal flow
            if (s.key === 'rejected' && !isRejected) return null;
            // Don't show other statuses if rejected
            if (isRejected && s.key !== 'rejected' && s.key !== 'pending') return null;
            
            return (
              <div key={s.key} className="flex flex-col items-center relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isCurrent 
                      ? 'bg-primary-600 scale-110 ring-4 ring-primary-100 dark:ring-primary-900' 
                      : isActive 
                        ? isRejected && s.key === 'rejected'
                          ? 'bg-red-500'
                          : 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {s.icon}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  isActive 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400'
                }`}>
                  {s.label}
                </span>
                {isCurrent && (
                  <span className="mt-1 text-[10px] text-gray-500">
                    {s.key === 'pending' ? new Date(appliedDate).toLocaleDateString() : 'Current'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {status === 'pending' && '⏳ Your application has been submitted'}
          {status === 'viewed' && '👀 Employer has viewed your application'}
          {status === 'shortlisted' && '⭐ You\'ve been shortlisted!'}
          {status === 'interviewing' && '💼 Interview scheduled or in progress'}
          {status === 'accepted' && '🎉 Congratulations! You got the job'}
          {status === 'rejected' && '😔 Unfortunately, you weren\'t selected this time'}
        </p>
        {viewedDate && status !== 'pending' && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date(viewedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MyApplicationsClient({ applications }: MyApplicationsClientProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobs.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'interviewing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'viewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const interviewingCount = applications.filter(a => a.status === 'interviewing').length;
  const responseRate = applications.length > 0 
    ? Math.round((applications.filter(a => a.status !== 'pending').length / applications.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Applications
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Track the status of your job applications
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-6 py-3 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 rounded-lg font-semibold transition-all shadow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Jobs
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{applications.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{interviewingCount}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{responseRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Search Applications
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title or company..."
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Filter by Status
                </label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="viewed">Viewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredApplications.length}</span> of {applications.length} applications
              </p>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search' : 'Start applying to jobs to see them here'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  href="/jobs"
                  className="inline-flex items-center px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {application.jobs.title}
                      </h3>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full uppercase ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{application.jobs.company}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        {application.jobs.job_type}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {application.jobs.experience_level}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {application.jobs.location}
                      </span>
                      {application.jobs.salary && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {application.jobs.salary}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Applied {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="ml-4">
                    <Link
                      href={`/jobs/${application.job_id}`}
                      className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 border border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors"
                    >
                      View Job
                    </Link>
                  </div>
                </div>

                {/* Status Tracker */}
                <ApplicationStatusTracker 
                  status={application.status}
                  appliedDate={application.created_at}
                  viewedDate={application.updated_at}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}