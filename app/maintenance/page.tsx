'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api/client';

export default function MaintenancePage() {
  const [message, setMessage] = useState<string>(
    'System is currently under maintenance. Please check back later.'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceMessage();
    
    // Check every 30 seconds if maintenance mode is still active
    const interval = setInterval(checkMaintenanceStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  async function fetchMaintenanceMessage() {
    try {
      const { data } = await apiClient.get<{ settings: { maintenance_message?: string } }>(
        '/settings/system'
      );
      if (data.settings?.maintenance_message) {
        setMessage(data.settings.maintenance_message);
      }
    } catch (error) {
      console.error('Error fetching maintenance message:', error);
    } finally {
      setLoading(false);
    }
  }

  async function checkMaintenanceStatus() {
    try {
      const { data } = await apiClient.get<{ settings: { maintenance_mode?: boolean } }>(
        '/settings/system'
      );
      if (!data.settings?.maintenance_mode) {
        // Maintenance mode is off, reload the page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
    }
  }

  function handleRefresh() {
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-6">
                <Wrench className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Under Maintenance
          </h1>

          {/* Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-700 text-left">
                {message}
              </p>
            </div>
          </div>

          {/* Info */}
          <p className="text-gray-600 mb-8">
            We're working hard to improve your experience. The system will be back online shortly.
          </p>

          {/* Refresh Button */}
          <Button
            onClick={handleRefresh}
            size="lg"
            className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 text-lg"
          >
            <RefreshCw className="h-5 w-5" />
            Check Again
          </Button>

          {/* Auto-check notice */}
          <p className="text-sm text-gray-500 mt-6">
            This page will automatically refresh when maintenance is complete
          </p>
        </div>
      </div>
    </div>
  );
}
