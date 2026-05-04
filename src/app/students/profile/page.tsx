'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import { api } from '@/app/lib/api';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  School,
  Star,
  Target,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentProfilePage() {
  const { user, loading: authLoading } = useAuthContext();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      const res = await api.get('/students/me');
      return res.data;
    },
    enabled: !!user && !authLoading,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Back Link */}
        <Link 
          href="/students/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-black text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage and verify your personal information.</p>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Main Info Card */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
            {/* Personal Details */}
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-primary" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <p className="text-lg font-semibold text-foreground">{profile.first_name} {profile.last_name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">{profile.email || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Grade / Level</label>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap size={16} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">{profile.grade || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">School Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <School size={16} className="text-muted-foreground" />
                    <p className="font-medium text-foreground">{profile.school || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Focus */}
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target size={20} className="text-indigo-500" /> Academic Profile
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Curriculum Preference</label>
                  <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                    <BookOpen size={16} />
                    <span className="font-bold">{profile.curricula?.name || 'Standard'}</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Learning Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0 ? (
                      profile.interests.map((interest: string, i: number) => (
                        <span key={i} className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No interests listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Areas for Improvement</label>
                  <div className="flex flex-wrap gap-2">
                    {profile.struggle_areas && Array.isArray(profile.struggle_areas) && profile.struggle_areas.length > 0 ? (
                      profile.struggle_areas.map((area: string, i: number) => (
                        <span key={i} className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium border border-red-100 dark:border-red-500/20">
                          {area}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No areas specified.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar / Status Card */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Enrollment Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-bold capitalize px-2 py-0.5 bg-primary/10 text-primary rounded-lg">
                    {profile.enrollment_status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-bold text-foreground">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Sessions Remaining</span>
                    <span className="font-black text-primary">{profile.sessions_remaining}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-full" 
                      style={{ width: `${Math.min(100, (profile.sessions_remaining / (profile.creditStatus?.credits_total || 10)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Tutor Card */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Your Expert Tutor</h3>
              {profile.trial_tutor ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                    {profile.trial_tutor.users.first_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">
                      {profile.trial_tutor.users.first_name} {profile.trial_tutor.users.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">Assigned Expert</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground italic mb-3">No tutor assigned yet.</p>
                  <Link href="/catalog" className="text-xs font-bold text-primary hover:underline">
                    Browse Tutors
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
