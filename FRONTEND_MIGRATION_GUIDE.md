# Frontend Migration Guide: Supabase → Express + Socket.IO

## 📋 Overview

This guide explains how to migrate the Next.js frontend from Supabase to the new Express.js backend with Socket.IO real-time updates.

---

## 🔧 Step 1: Install Dependencies

```bash
cd client_app
npm install socket.io-client axios
```

---

## 🔑 Step 2: Environment Variables

Update `.env.local`:

```env
# Old Supabase (comment out or remove)
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# New Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 📡 Step 3: Create API Client

Create `lib/api/client.ts`:

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🔌 Step 4: Create Socket.IO Client

Create `lib/socket/client.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = localStorage.getItem('auth_token');
    
    socket = io(SOCKET_URL, {
      auth: {
        token: token || undefined,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export default getSocket;
```

---

## 🔄 Step 5: Update Authentication Service

Update `lib/services/auth-service.ts`:

```typescript
import apiClient from '@/lib/api/client';

export async function login(email: string, password: string) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  
  // Store token
  localStorage.setItem('auth_token', data.token);
  
  return data.user;
}

export async function logout() {
  await apiClient.post('/auth/logout');
  localStorage.removeItem('auth_token');
}

export async function getCurrentUser() {
  const { data } = await apiClient.get('/auth/me');
  return data.user;
}

export async function register(userData: any) {
  const { data } = await apiClient.post('/auth/register', userData);
  return data.user;
}
```

---

## 🎫 Step 6: Update Queue Service

Update `lib/services/queue-service.ts`:

```typescript
import apiClient from '@/lib/api/client';
import { CreateTicketParams, Ticket, TicketWithDetails } from '@/types/queue';

export async function createTicket(params: CreateTicketParams): Promise<Ticket | null> {
  try {
    const { data } = await apiClient.post('/tickets', params);
    return data.ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    return null;
  }
}

export async function getTicket(ticketId: string): Promise<TicketWithDetails | null> {
  try {
    const { data } = await apiClient.get(`/tickets/${ticketId}`);
    return data.ticket;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
}

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

    const { data } = await apiClient.get(`/tickets?${params.toString()}`);
    return data.tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

export async function callNextTicket(
  serviceId: string,
  counterId: string
): Promise<Ticket | null> {
  try {
    const { data } = await apiClient.post('/tickets/call-next', {
      service_id: serviceId || null,
      counter_id: counterId,
    });
    return data.ticket;
  } catch (error) {
    console.error('Error calling next ticket:', error);
    return null;
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: 'waiting' | 'serving' | 'done' | 'skipped' | 'cancelled',
  updates?: {
    counter_id?: string;
    notes?: string;
  }
): Promise<Ticket | null> {
  try {
    const { data } = await apiClient.patch(`/tickets/${ticketId}`, {
      status,
      ...updates,
    });
    return data.ticket;
  } catch (error) {
    console.error('Error updating ticket:', error);
    return null;
  }
}

export async function cancelTicket(ticketId: string): Promise<boolean> {
  try {
    await apiClient.delete(`/tickets/${ticketId}`);
    return true;
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    return false;
  }
}
```

---

## 🔄 Step 7: Update Real-time Hooks

Update `lib/hooks/use-realtime-tickets.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { TicketWithDetails } from '@/types/queue';
import { getTickets } from '@/lib/services/queue-service';
import getSocket from '@/lib/socket/client';

interface UseRealtimeTicketsOptions {
  branchId: string;
  serviceId?: string;
  status?: string;
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

    // Fetch initial tickets
    async function fetchInitialTickets() {
      try {
        const data = await getTickets(options.branchId, {
          status: options.status,
          serviceId: options.serviceId,
        });
        setTickets(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialTickets();

    // Join branch room
    socket.emit('join:branch', options.branchId);

    // Listen for ticket events
    socket.on('ticket:created', (ticket: TicketWithDetails) => {
      console.log('📡 Ticket created:', ticket.ticket_number);
      setTickets((prev) => [ticket, ...prev]);
    });

    socket.on('ticket:updated', (ticket: TicketWithDetails) => {
      console.log('📡 Ticket updated:', ticket.ticket_number, ticket.status);
      
      setTickets((prev) => {
        const existingIndex = prev.findIndex((t) => t.id === ticket.id);
        const matchesFilter = !options.status || ticket.status === options.status;

        if (matchesFilter) {
          if (existingIndex >= 0) {
            // Update existing
            return prev.map((t) => (t.id === ticket.id ? ticket : t));
          } else {
            // Add new
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

    socket.on('ticket:deleted', ({ id }: { id: string }) => {
      console.log('📡 Ticket deleted:', id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    });

    // Cleanup
    return () => {
      socket.emit('leave:branch', options.branchId);
      socket.off('ticket:created');
      socket.off('ticket:updated');
      socket.off('ticket:deleted');
    };
  }, [options.branchId, options.serviceId, options.status]);

  return { tickets, loading, error };
}
```

---

## 📝 Step 8: Update useAuth Hook

Update `lib/hooks/use-auth.tsx`:

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, logout as logoutService, getCurrentUser } from '@/lib/services/auth-service';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'staff';
  branch_id: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = await loginService(email, password);
    setUser(user);
    router.push('/staff');
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, profile: user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## ✅ Migration Checklist

### Backend Setup
- [ ] Install XAMPP and start MariaDB
- [ ] Run database schema SQL file
- [ ] Install backend dependencies (`npm install`)
- [ ] Configure `.env` file
- [ ] Start Express server (`npm run dev`)
- [ ] Test API endpoints with Postman

### Frontend Updates
- [ ] Install socket.io-client and axios
- [ ] Update environment variables
- [ ] Create API client wrapper
- [ ] Create Socket.IO client wrapper
- [ ] Update auth service
- [ ] Update queue service
- [ ] Update real-time hooks
- [ ] Update all other services
- [ ] Test each module

### Testing
- [ ] Test login/logout
- [ ] Test ticket creation (kiosk)
- [ ] Test real-time updates (display)
- [ ] Test staff operations
- [ ] Test admin functions
- [ ] Load testing

---

## 🚀 Running the System

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start Apache and MySQL

### 2. Start Backend
```bash
cd server
npm run dev
```

### 3. Start Frontend
```bash
cd client_app
npm run dev
```

### 4. Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- phpMyAdmin: http://localhost/phpmyadmin

---

## 🔍 Troubleshooting

### Socket.IO not connecting
- Check CORS settings in backend
- Verify Socket.IO URL in frontend
- Check browser console for errors

### API requests failing
- Verify backend is running
- Check API URL in environment variables
- Verify JWT token is being sent

### Real-time updates not working
- Check Socket.IO connection status
- Verify room joining (branch_id)
- Check backend event emissions

---

**Migration Complete!** 🎉

Your system is now running on local infrastructure with MariaDB and Socket.IO for blazing-fast real-time updates.
