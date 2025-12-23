'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { Counter } from '@/types/queue';
import { io, Socket } from 'socket.io-client';

export function useRealtimeCounters(branchId: string) {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Don't fetch if branchId is empty
    if (!branchId) {
      setLoading(false);
      return;
    }

    let socket: Socket;

    async function fetchInitialCounters() {
      try {
        const { data } = await apiClient.get<{ counters: Counter[] }>('/counters', {
          params: { branch_id: branchId }
        });

        setCounters(data.counters || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    function setupRealtimeSubscription() {
      const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
      socket = io(socketUrl);

      // Join branch room
      socket.emit('join:branch', branchId);

      // Listen for counter updates
      socket.on('counter:updated', (updatedCounter: Counter) => {
        if (updatedCounter.branch_id === branchId) {
          setCounters((prev) =>
            prev.map((counter) =>
              counter.id === updatedCounter.id ? updatedCounter : counter
            )
          );
        }
      });

      // Listen for counter creation
      socket.on('counter:created', (newCounter: Counter) => {
        if (newCounter.branch_id === branchId) {
          setCounters((prev) => [...prev, newCounter]);
        }
      });

      // Listen for counter deletion
      socket.on('counter:deleted', (deletedId: string) => {
        setCounters((prev) => prev.filter((counter) => counter.id !== deletedId));
      });
    }

    fetchInitialCounters();
    setupRealtimeSubscription();

    return () => {
      if (socket) {
        socket.emit('leave:branch', branchId);
        socket.disconnect();
      }
    };
  }, [branchId]);

  return { counters, loading, error };
}