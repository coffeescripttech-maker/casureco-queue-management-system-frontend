/**
 * Authentication Service - New Backend API
 */

import apiClient from '@/lib/api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'staff';
  branch_id: string;
  branch_name?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn: string;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', { 
    email, 
    password 
  });
  
  // Store token in both localStorage AND cookie for middleware
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.token);
    
    // Set cookie for middleware (7 days expiry)
    const expiryDays = 7;
    const date = new Date();
    date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    document.cookie = `auth_token=${data.token}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  }
  
  return data;
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove token from both localStorage and cookie
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Remove cookie
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<{ user: User }>('/auth/me');
  return data.user;
}

/**
 * Register new user (admin only)
 */
export async function register(userData: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'supervisor' | 'staff';
  branch_id?: string;
}): Promise<User> {
  const { data } = await apiClient.post<{ user: User }>('/auth/register', userData);
  return data.user;
}

/**
 * Change password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiClient.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

/**
 * Get stored auth token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}
