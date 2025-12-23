import { useEffect, useRef } from 'react';
import { ttsService } from '@/lib/services/tts-service';
import { TicketWithDetails } from '@/types/queue';
import getSocket from '@/lib/socket/client';

export function useTicketAnnouncements(
  tickets: TicketWithDetails[],
  enabled: boolean = true
) {
  const previousTicketsRef = useRef<Set<string>>(new Set());

  // Setup Socket.IO listener once (separate from ticket monitoring)
  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();

    console.log('🔊 TTS: Setting up announcement:replay listener');

    // Listen for manual replay requests from staff
    const handleReplay = (data: { ticket_number: string; counter_name: string }) => {
      console.log('🔊 TTS: Replay announcement received:', data);
      ttsService.announceTicket(data.ticket_number, data.counter_name).catch(error => {
        console.error('🔊 TTS: Replay announcement failed:', error);
      });
    };

    socket.on('announcement:replay', handleReplay);
    console.log('🔊 TTS: Listener registered for announcement:replay');

    return () => {
      console.log('🔊 TTS: Removing announcement:replay listener');
      socket.off('announcement:replay', handleReplay);
    };
  }, [enabled]); // Only depends on enabled, not tickets

  // Monitor ticket changes for auto-announcements
  useEffect(() => {
    if (!enabled) return;

    // Find newly serving tickets
    const servingTickets = tickets.filter(t => t.status === 'serving');
    
    servingTickets.forEach(ticket => {
      // Check if this ticket was just called (not announced before)
      if (!previousTicketsRef.current.has(ticket.id)) {
        console.log('🔊 TTS: New ticket called:', ticket.ticket_number);
        
        // Announce the ticket
        ttsService.announceTicket(
          ticket.ticket_number,
          ticket.counter?.name || 'Counter'
        ).catch(error => {
          console.error('🔊 TTS: Announcement failed:', error);
        });
        
        // Mark as announced
        previousTicketsRef.current.add(ticket.id);
      }
    });

    // Clean up old tickets from tracking
    const servingIds = new Set(servingTickets.map(t => t.id));
    previousTicketsRef.current.forEach(id => {
      if (!servingIds.has(id)) {
        previousTicketsRef.current.delete(id);
      }
    });
  }, [tickets, enabled]);

  return {
    isSupported: ttsService.isSupported(),
    stop: () => ttsService.stop(),
  };
}