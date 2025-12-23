'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import getSocket from '@/lib/socket/client';
import { ChevronRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  is_active: boolean;
}

interface ScrollingTickerProps {
  branchId: string;
}

export function ScrollingTicker({ branchId }: ScrollingTickerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [defaultMessage, setDefaultMessage] = useState<string>(
    'Welcome to CASURECO II Queue Management System • Please wait for your number to be called • Thank you for your patience'
  );

  useEffect(() => {
    if (!branchId) return;

    const socket = getSocket();
    let mounted = true;

    async function fetchAnnouncements() {
      try {
        const { data } = await apiClient.get<{ announcements: Announcement[] }>(
          `/announcements?branch_id=${branchId}&is_active=true`
        );
        if (mounted) {
          setAnnouncements(data.announcements);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    }

    async function fetchSettings() {
      try {
        const { data } = await apiClient.get<{ settings: { default_ticker_message?: string } }>(
          '/settings/system'
        );
        if (mounted && data.settings?.default_ticker_message) {
          setDefaultMessage(data.settings.default_ticker_message);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    }

    fetchAnnouncements();
    fetchSettings();

    // Subscribe to Socket.IO events
    socket.emit('join:branch', branchId);
    socket.on('announcement:created', fetchAnnouncements);
    socket.on('announcement:updated', fetchAnnouncements);
    socket.on('announcement:deleted', fetchAnnouncements);
    socket.on('settings:updated', fetchSettings);

    return () => {
      mounted = false;
      socket.emit('leave:branch', branchId);
      socket.off('announcement:created', fetchAnnouncements);
      socket.off('announcement:updated', fetchAnnouncements);
      socket.off('announcement:deleted', fetchAnnouncements);
      socket.off('settings:updated', fetchSettings);
    };
  }, [branchId]);

  // Create ticker text
  const tickerText = announcements.length > 0
    ? announcements.map(a => `${a.title}: ${a.message}`).join(' • ')
    : defaultMessage;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0033A0] to-[#1A237E] py-4 shadow-lg">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-yellow-400 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-yellow-400 to-transparent" />
      </div>
      
      <div className="relative flex items-center gap-3 px-4">
        <div className="flex-shrink-0 rounded-lg bg-yellow-400 px-3 py-1.5">
          <ChevronRight className="h-5 w-5 text-[#0033A0]" />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            <span className="inline-block text-xl font-semibold text-white px-4">
              {tickerText}
            </span>
            <span className="inline-block text-xl font-semibold text-white px-4">
              {tickerText}
            </span>
            <span className="inline-block text-xl font-semibold text-white px-4">
              {tickerText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
