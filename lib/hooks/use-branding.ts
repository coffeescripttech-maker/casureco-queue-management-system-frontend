import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';

interface BrandingSettings {
  id: string;
  logo_url?: string;
  company_name: string;
  primary_color: string;
  secondary_color: string;
  ticket_header_text: string;
  ticket_footer_text: string;
  show_qr_code: boolean;
  show_logo_on_ticket: boolean;
  ticket_border_color: string;
}

const DEFAULT_BRANDING: BrandingSettings = {
  id: 'default',
  company_name: process.env.NEXT_PUBLIC_APP_NAME || 'NAGA Queue System',
  primary_color: '#2563EB',
  secondary_color: '#1E40AF',
  ticket_header_text: 'Please keep your ticket',
  ticket_footer_text: 'Thank you for your patience',
  show_qr_code: true,
  show_logo_on_ticket: true,
  ticket_border_color: '#2563EB',
};

export function useBranding() {
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranding();
    
    // Poll for changes every 30 seconds (can be replaced with Socket.IO later)
    const interval = setInterval(fetchBranding, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchBranding = async () => {
    try {
      const { data } = await apiClient.get<{ branding: BrandingSettings }>('/settings/branding');
      
      if (data.branding) {
        setBranding(data.branding);
      } else {
        setBranding(DEFAULT_BRANDING);
      }
    } catch (error) {
      console.error('Error fetching branding:', error);
      setBranding(DEFAULT_BRANDING);
    } finally {
      setLoading(false);
    }
  };

  return { branding, loading };
}
