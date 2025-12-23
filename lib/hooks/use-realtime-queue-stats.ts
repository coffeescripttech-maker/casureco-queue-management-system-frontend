'use client';

import { useEffect, useState } from 'react';
import { getQueueStats } from '@/lib/services/queue-service';
import { QueueStats } from '@/types/queue';
import getSocket from '@/lib/socket/client';

export function useRealtimeQueueStats(branchId: string) {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch if branchId is empty
    if (!branchId) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const socket = getSocket();
    let intervalId: NodeJS.Timeout;
    let mounted = true;

    async function fetchStats() {
      const data = await getQueueStats(branchId);
      if (mounted) {
        setStats(data);
        setLoading(false);
      }
    }

    function setupRealtimeSubscription() {
      // Join branch room
      socket.emit('join:branch', branchId);

      // Listen to ticket changes to trigger stats refresh
      socket.on('ticket:created', fetchStats);
      socket.on('ticket:updated', fetchStats);
      socket.on('ticket:deleted', fetchStats);

      // Also refresh stats every 30 seconds
      intervalId = setInterval(fetchStats, 30000);
    }

    fetchStats();
    setupRealtimeSubscription();

    return () => {
      mounted = false;
      socket.emit('leave:branch', branchId);
      socket.off('ticket:created', fetchStats);
      socket.off('ticket:updated', fetchStats);
      socket.off('ticket:deleted', fetchStats);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [branchId]);

  return { stats, loading };
}