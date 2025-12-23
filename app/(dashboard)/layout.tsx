'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated or not active
    if (!loading && (!profile || !profile.is_active)) {
      router.replace('/login');
    }
  }, [profile, loading, router]);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // Don't render if no profile or inactive
  if (!profile || !profile.is_active) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Shared Sidebar with role-based navigation */}
      <AdminSidebar role={profile.role as 'admin' | 'supervisor' | 'staff'} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Shared Header */}
        <AdminHeader profile={profile} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}