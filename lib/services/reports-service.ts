import apiClient from '@/lib/api/client';

export interface DailySummary {
  date: string;
  total_tickets: number;
  completed: number;
  cancelled: number;
  skipped: number;
  waiting: number;
  serving: number;
  avg_service_time: number;
  avg_wait_time: number;
  service_name?: string;
}

export interface StaffPerformance {
  staff_id: string;
  staff_name: string;
  counter_name: string;
  date: string;
  tickets_served: number;
  completed: number;
  avg_service_time: number;
  tickets_transferred_out: number;
  tickets_transferred_in: number;
}

export interface HourlyTraffic {
  day_of_week: number;
  hour: number;
  ticket_count: number;
  avg_wait_time: number;
}

export interface WeeklySummary {
  week_start: string;
  total_tickets: number;
  completed: number;
  avg_wait_time: number;
  peak_day: string;
}

/**
 * Get daily summary for a date range
 */
export async function getDailySummary(
  branchId: string,
  startDate: Date,
  endDate: Date
): Promise<DailySummary[]> {
  try {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    const { data } = await apiClient.get<{ daily_summary: DailySummary[] }>('/reports/daily-summary', {
      params: {
        branch_id: branchId,
        start_date: start,
        end_date: end,
      },
    });

    return data.daily_summary || [];
  } catch (error) {
    console.error('Error fetching daily summary:', error);
    return [];
  }
}

/**
 * Get weekly summary
 */
export async function getWeeklySummary(
  branchId: string,
  startDate: Date,
  endDate: Date
): Promise<WeeklySummary[]> {
  const dailySummaries = await getDailySummary(branchId, startDate, endDate);
  
  // Group by week
  const weeklyMap = new Map<string, WeeklySummary>();

  dailySummaries.forEach((daily) => {
    const date = new Date(daily.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, {
        week_start: weekKey,
        total_tickets: 0,
        completed: 0,
        avg_wait_time: 0,
        peak_day: '',
      });
    }

    const weekly = weeklyMap.get(weekKey)!;
    weekly.total_tickets += daily.total_tickets;
    weekly.completed += daily.completed;
    weekly.avg_wait_time = 
      (weekly.avg_wait_time + daily.avg_wait_time) / 2;
  });

  return Array.from(weeklyMap.values());
}

/**
 * Get staff performance metrics
 */
export async function getStaffPerformance(
  branchId: string,
  startDate: Date,
  endDate: Date
): Promise<StaffPerformance[]> {
  try {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    const { data } = await apiClient.get<{ staff_performance: StaffPerformance[] }>('/reports/staff-performance', {
      params: {
        branch_id: branchId,
        start_date: start,
        end_date: end,
      },
    });

    return data.staff_performance || [];
  } catch (error) {
    console.error('Error fetching staff performance:', error);
    return [];
  }
}

/**
 * Get hourly traffic for heatmap
 */
export async function getHourlyTraffic(
  branchId: string,
  startDate: Date,
  endDate: Date
): Promise<HourlyTraffic[]> {
  try {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    const { data } = await apiClient.get<{ hourly_traffic: HourlyTraffic[] }>('/reports/hourly-traffic', {
      params: {
        branch_id: branchId,
        start_date: start,
        end_date: end,
      },
    });

    return data.hourly_traffic || [];
  } catch (error) {
    console.error('Error fetching hourly traffic:', error);
    return [];
  }
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => JSON.stringify(row[header] ?? '')).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}
