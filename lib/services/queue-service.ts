/**
 * Queue Service - New Backend API
 * Handles all ticket and queue operations
 */

import apiClient from '@/lib/api/client';
import { CreateTicketParams, Ticket, TicketWithDetails } from '@/types/queue';

/**
 * Create a new ticket in the queue
 */
export async function createTicket(params: CreateTicketParams): Promise<Ticket | null> {
  try {
    const { data } = await apiClient.post<{ ticket: Ticket }>('/tickets', {
      service_id: params.service_id,
      branch_id: params.branch_id,
      priority_level: params.priority_level || 0,
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      notes: params.notes,
    });
    
    return data.ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    return null;
  }
}

/**
 * Get ticket by ID with service and counter details
 */
export async function getTicket(ticketId: string): Promise<TicketWithDetails | null> {
  try {
    const { data } = await apiClient.get<{ ticket: TicketWithDetails }>(`/tickets/${ticketId}`);
    return data.ticket;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
}

/**
 * Get tickets with filters
 */
export async function getTickets(
  branchId: string,
  filters?: {
    status?: string;
    serviceId?: string;
    counterId?: string;
    date?: Date;
  }
): Promise<TicketWithDetails[]> {
  try {
    const params = new URLSearchParams();
    params.append('branch_id', branchId);
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.serviceId) params.append('service_id', filters.serviceId);
    if (filters?.counterId) params.append('counter_id', filters.counterId);
    if (filters?.date) params.append('date', filters.date.toISOString().split('T')[0]);

    const { data } = await apiClient.get<{ tickets: TicketWithDetails[] }>(
      `/tickets?${params.toString()}`
    );
    
    return data.tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

/**
 * Get all waiting tickets for a service
 */
export async function getWaitingTickets(
  serviceId: string,
  branchId: string
): Promise<TicketWithDetails[]> {
  return getTickets(branchId, { status: 'waiting', serviceId });
}

/**
 * Get all tickets for today
 */
export async function getTodayTickets(branchId: string): Promise<TicketWithDetails[]> {
  return getTickets(branchId, { date: new Date() });
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(
  ticketId: string,
  status: 'waiting' | 'serving' | 'done' | 'skipped' | 'cancelled',
  updates?: {
    counter_id?: string;
    notes?: string;
  }
): Promise<Ticket | null> {
  try {
    const { data } = await apiClient.patch<{ ticket: Ticket }>(`/tickets/${ticketId}`, {
      status,
      ...updates,
    });
    
    return data.ticket;
  } catch (error) {
    console.error('Error updating ticket:', error);
    return null;
  }
}

/**
 * Call next ticket in queue
 */
export async function callNextTicket(
  serviceId: string | null,
  counterId: string
): Promise<Ticket | null> {
  try {
    const { data } = await apiClient.post<{ ticket: Ticket | null }>('/tickets/call-next', {
      service_id: serviceId,
      counter_id: counterId,
    });
    
    return data.ticket;
  } catch (error) {
    console.error('Error calling next ticket:', error);
    return null;
  }
}

/**
 * Cancel ticket
 */
export async function cancelTicket(ticketId: string): Promise<boolean> {
  try {
    await apiClient.delete(`/tickets/${ticketId}`);
    return true;
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    return false;
  }
}

/**
 * Complete ticket (mark as done)
 */
export async function completeTicket(ticketId: string): Promise<Ticket | null> {
  return updateTicketStatus(ticketId, 'done');
}

/**
 * Skip ticket
 */
export async function skipTicket(ticketId: string): Promise<Ticket | null> {
  return updateTicketStatus(ticketId, 'skipped');
}

/**
 * Transfer ticket to another counter
 */
export async function transferTicket(
  ticketId: string,
  targetCounterId: string,
  reason?: string
): Promise<Ticket | null> {
  return updateTicketStatus(ticketId, 'waiting', {
    counter_id: targetCounterId,
    notes: reason,
  });
}

/**
 * Calculate queue position for a ticket
 */
export function calculateQueuePosition(
  ticket: Ticket,
  allTickets: Ticket[]
): number {
  const waitingTickets = allTickets
    .filter(
      (t) =>
        t.service_id === ticket.service_id &&
        t.status === 'waiting' &&
        new Date(t.created_at) < new Date(ticket.created_at)
    )
    .sort((a, b) => {
      // Priority tickets first
      if (a.priority_level !== b.priority_level) {
        return b.priority_level - a.priority_level;
      }
      // Then by creation time
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  return waitingTickets.length + 1;
}

/**
 * Calculate estimated wait time
 */
export function calculateWaitTime(
  queuePosition: number,
  avgServiceTime: number = 300 // 5 minutes default
): number {
  return queuePosition * avgServiceTime;
}

/**
 * Format wait time to human readable string
 */
export function formatWaitTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
}

/**
 * Get queue statistics for a branch
 */
export async function getQueueStats(branchId: string): Promise<any> {
  try {
    const { data } = await apiClient.get(`/reports/stats?branch_id=${branchId}`);
    return data.stats || {};
  } catch (error) {
    console.error('Error fetching queue stats:', error);
    return {};
  }
}
