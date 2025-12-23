import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';
import { io, Socket } from 'socket.io-client';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  content_type: 'text' | 'video' | 'image' | 'slideshow';
  media_url?: string;
  media_urls?: string[];
  thumbnail_url?: string;
  audio_url?: string;
  enable_tts: boolean;
  tts_voice: string;
  tts_speed: number;
  play_audio_on_display: boolean;
  loop_media: boolean;
  transition_duration: number;
  is_active: boolean;
  display_duration: number;
  priority: number;
  start_date?: string;
  end_date?: string;
}

export function useDisplayAnnouncements(branchId: string) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!branchId) return;

    let socket: Socket;

    async function fetchAnnouncements() {
      try {
        const { data } = await apiClient.get<{ announcements: Announcement[] }>('/announcements', {
          params: {
            branch_id: branchId,
            is_active: true,
            include_global: true // Include announcements with null branch_id
          }
        });

        setAnnouncements(data.announcements || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    }

    function setupRealtimeSubscription() {
      const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      socket = io(socketUrl);

      // Join branch room for targeted updates
      socket.emit('join:branch', branchId);

      // Listen for announcement changes
      socket.on('announcement:new', (announcement: Announcement) => {
        // Check if announcement is for this branch or global
        if (announcement.branch_id === branchId || !announcement.branch_id) {
          if (announcement.is_active) {
            // Refresh announcements to get updated list with proper filtering
            fetchAnnouncements();
          }
        }
      });

      socket.on('announcement:updated', (announcement: Announcement) => {
        if (announcement.branch_id === branchId || !announcement.branch_id) {
          // Refresh to ensure proper filtering and sorting
          fetchAnnouncements();
        }
      });

      socket.on('announcement:deleted', (announcementId: string) => {
        // Remove from list immediately
        setAnnouncements((prev) => prev.filter((a) => a.id !== announcementId));
      });

      socket.on('connect', () => {
        console.log('🔌 Connected to announcement updates');
      });

      socket.on('disconnect', () => {
        console.log('🔌 Disconnected from announcement updates');
      });
    }

    fetchAnnouncements();
    setupRealtimeSubscription();

    return () => {
      if (socket) {
        socket.emit('leave:branch', branchId);
        socket.disconnect();
      }
    };
  }, [branchId]);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length === 0) return;

    const currentAnnouncement = announcements[currentIndex];
    const duration = (currentAnnouncement?.display_duration || 10) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [announcements, currentIndex]);

  const currentAnnouncement = announcements.length > 0 ? announcements[currentIndex] : null;

  return {
    announcements,
    currentAnnouncement,
    loading,
    totalCount: announcements.length,
  };
}
