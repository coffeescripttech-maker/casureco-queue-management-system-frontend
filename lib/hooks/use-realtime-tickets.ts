/**
 * Real-time Tickets Hook - Socket.IO
 * Replaces Supabase Realtime with Socket.IO
 */

'use client';

import { useEffect, useState } from 'react';
import { TicketWithDetails } from '@/types/queue';
import { getTickets } from '@/lib/services/queue-service';
import getSocket from '@/lib/socket/client';

interface UseRealtimeTicketsOptions {
  branchId: string;
  serviceId?: string;
  status?: string;
  counterId?: string;
}

export function useRealtimeTickets(options: UseRealtimeTicketsOptions) {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!options.branchId) {
      setLoading(false);
      return;
    }

    const socket = getSocket();
    let mounted = true;

    // Fetch initial tickets
    async function fetchInitialTickets() {
      try {
        const data = await getTickets(options.branchId, {
          status: options.status,
          serviceId: options.serviceId,
          counterId: options.counterId,
        });
        
        if (mounted) {
          setTickets(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    fetchInitialTickets();

    // Join branch room for real-time updates
    socket.emit('join:branch', options.branchId);
    console.log(`📡 Joined branch room: ${options.branchId}`);

    // Listen for ticket created
    socket.on('ticket:created', (ticket: TicketWithDetails) => {
      console.log('📡 Ticket created:', ticket.ticket_number);
      
      if (!mounted) return;
      
      // Check if ticket matches filters
      const matchesFilter = 
        (!options.status || ticket.status === options.status) &&
        (!options.serviceId || ticket.service_id === options.serviceId) &&
        (!options.counterId || ticket.counter_id === options.counterId);

      if (matchesFilter) {
        setTickets((prev) => {
          // Avoid duplicates
          if (prev.some((t) => t.id === ticket.id)) {
            return prev;
          }
          return [ticket, ...prev];
        });
      }
    });

    // Listen for ticket updated
    socket.on('ticket:updated', (ticket: TicketWithDetails) => {
      console.log('📡 Ticket updated:', ticket.ticket_number, ticket.status);
      
      if (!mounted) return;

      const matchesFilter =
        (!options.status || ticket.status === options.status) &&
        (!options.serviceId || ticket.service_id === options.serviceId) &&
        (!options.counterId || ticket.counter_id === options.counterId);

      setTickets((prev) => {
        const existingIndex = prev.findIndex((t) => t.id === ticket.id);

        if (matchesFilter) {
          if (existingIndex >= 0) {
            // Update existing ticket
            const updated = [...prev];
            updated[existingIndex] = ticket;
            return updated;
          } else {
            // Add new ticket
            return [ticket, ...prev];
          }
        } else {
          // Remove if doesn't match filter
          if (existingIndex >= 0) {
            return prev.filter((t) => t.id !== ticket.id);
          }
          return prev;
        }
      });
    });

    // Listen for ticket called (announcement)
    socket.on('ticket:called', (data: { ticket_number: string; counter_name: string }) => {
      console.log('📢 Ticket called:', data.ticket_number, 'at', data.counter_name);
      // This is mainly for display/announcement purposes
      // The ticket:updated event will handle the actual state update
    });

    // Listen for ticket deleted
    socket.on('ticket:deleted', (data: { id: string }) => {
      console.log('📡 Ticket deleted:', data.id);
      
      if (!mounted) return;
      
      setTickets((prev) => prev.filter((t) => t.id !== data.id));
    });

    // Cleanup
    return () => {
      mounted = false;
      socket.emit('leave:branch', options.branchId);
      socket.off('ticket:created');
      socket.off('ticket:updated');
      socket.off('ticket:called');
      socket.off('ticket:deleted');
      console.log(`📡 Left branch room: ${options.branchId}`);
    };
  }, [options.branchId, options.serviceId, options.status, options.counterId]);

  return { tickets, loading, error, refetch: () => setLoading(true) };
}

/**
 * Hook for monitoring specific ticket
 */
export function useRealtimeTicket(ticketId: string) {
  const [ticket, setTicket] = useState<TicketWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketId) {
      setLoading(false);
      return;
    }

    const socket = getSocket();
    let mounted = true;

    // Listen for updates to this specific ticket
    socket.on('ticket:updated', (updatedTicket: TicketWithDetails) => {
      if (mounted && updatedTicket.id === ticketId) {
        setTicket(updatedTicket);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      socket.off('ticket:updated');
    };
  }, [ticketId]);

  return { ticket, loading };
}
