'use client';

import { useState, useEffect } from 'react';
import { KioskHeader } from '@/components/kiosk/kiosk-header';
import { ServiceSelection } from '@/components/kiosk/service-selection';
import { TicketPrint } from '@/components/kiosk/ticket-print';
import { Service } from '@/types/queue';
import apiClient from '@/lib/api/client';

export default function KioskPage() {
  const [branchId, setBranchId] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get branch ID from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const urlBranchId = params.get('branch') || localStorage.getItem('kiosk_branch_id');
    
    if (urlBranchId) {
      setBranchId(urlBranchId);
      localStorage.setItem('kiosk_branch_id', urlBranchId);
    } else {
      // Default to Main Branch
      setBranchId('071aa7e0-d588-11f0-93ae-088fc3019fcf');
    }
  }, []);

  useEffect(() => {
    if (!branchId) return;

    async function fetchServices() {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get<{ services: Service[] }>(
          `/services?branch_id=${branchId}&is_active=true`
        );
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [branchId]);

  function handleTicketCreated(ticket: any) {
    setSelectedTicket(ticket);
  }

  function handleReset() {
    setSelectedTicket(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <KioskHeader />
      
      <main className="container mx-auto px-4 py-8">
        {selectedTicket ? (
          <TicketPrint ticket={selectedTicket} onReset={handleReset} />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading services...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait</p>
          </div>
        ) : (
          <ServiceSelection
            services={services}
            branchId={branchId}
            onTicketCreated={handleTicketCreated}
          />
        )}
      </main>
    </div>
  );
}