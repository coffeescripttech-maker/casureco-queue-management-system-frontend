import apiClient from '@/lib/api/client';
import { Counter } from '@/types/queue';

/**
 * Assign staff to a counter
 */
export async function assignCounter(counterId: string, staffId: string): Promise<Counter | null> {
  try {
    const { data } = await apiClient.patch<{ counter: Counter }>(
      `/counters/${counterId}`,
      {
        staff_id: staffId,
        is_active: true,
        last_ping: new Date().toISOString(),
      }
    );
    return data.counter;
  } catch (error) {
    console.error('Error assigning counter:', error);
    return null;
  }
}

/**
 * Release staff from counter
 */
export async function releaseCounter(counterId: string): Promise<boolean> {
  try {
    await apiClient.patch(`/counters/${counterId}`, {
      staff_id: null,
      is_active: false,
      current_ticket_id: null,
    });
    return true;
  } catch (error) {
    console.error('Error releasing counter:', error);
    return false;
  }
}

/**
 * Update counter heartbeat
 */
export async function updateCounterHeartbeat(counterId: string): Promise<boolean> {
  try {
    await apiClient.post(`/counters/${counterId}/heartbeat`);
    return true;
  } catch (error) {
    console.error('Error updating heartbeat:', error);
    return false;
  }
}

/**
 * Get available counters for a branch
 */
export async function getAvailableCounters(branchId: string): Promise<Counter[]> {
  try {
    const { data } = await apiClient.get<{ counters: Counter[] }>(
      `/counters?branch_id=${branchId}&available=true&sort=name:asc`
    );
    return data.counters || [];
  } catch (error) {
    console.error('Error fetching available counters:', error);
    return [];
  }
}

/**
 * Get counter by staff ID
 */
export async function getCounterByStaff(staffId: string): Promise<Counter | null> {
  try {
    const { data } = await apiClient.get<{ counters: Counter[] }>(
      `/counters?staff_id=${staffId}`
    );
    return data.counters[0] || null;
  } catch (error) {
    return null;
  }
}