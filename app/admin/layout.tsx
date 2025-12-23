'use client';

import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { useAuth } from '@/lib/hooks/use-auth';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    // Redirect if not authorized (only after loading is complete)
    if (!loading && (!profile || (profile.role !== 'admin' && profile.role !== 'supervisor'))) {
      router.replace('/login');
    }
  }, [profile, loading, router]);

  // Show nothing while loading or checking authorization
  if (loading) {
    return null;
  }

  // Don't render if no profile or not authorized
  if (!profile || (profile.role !== 'admin' && profile.role !== 'supervisor')) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <AdminSidebar role={profile.role as 'admin' | 'staff' | 'supervisor'} />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader profile={profile} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}