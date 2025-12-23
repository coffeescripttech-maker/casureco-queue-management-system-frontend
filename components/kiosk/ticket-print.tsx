'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Printer, Home } from 'lucide-react';
import { formatDate, formatDuration } from '@/lib/utils';
import { calculateQueuePosition, calculateWaitTime } from '@/lib/services/queue-service';
import { useBranding } from '@/lib/hooks/use-branding';
import { printTicketDirect } from '@/lib/services/printer-service';
import { toast } from 'sonner';

interface TicketPrintProps {
  ticket: any;
  onReset: () => void;
}

export function TicketPrint({ ticket, onReset }: TicketPrintProps) {
  const { branding } = useBranding();
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWait, setEstimatedWait] = useState<number>(0);
  const [countdown, setCountdown] = useState(15);
  const [isAndroid, setIsAndroid] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Detect if running on Android
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
  }, []);

  // Generate plain text ticket for RawBT (Android thermal printer)
  const generateRawBTTicket = () => {
    const lines: string[] = [];
    
    // Center align helper
    const center = (text: string, width = 32) => {
      const padding = Math.max(0, Math.floor((width - text.length) / 2));
      return ' '.repeat(padding) + text;
    };
    
    // Header
    lines.push(center(branding.company_name));
    lines.push(center(formatDate(new Date())));
    lines.push('--------------------------------');
    lines.push('');
    
    // Ticket Number (Large)
    lines.push(center('YOUR TICKET NUMBER'));
    lines.push('');
    lines.push(center(ticket.ticket_number));
    lines.push('');
    lines.push('--------------------------------');
    
    // Service Info
    lines.push('');
    lines.push(`Service: ${ticket.service?.name || 'N/A'}`);
    
    if (queuePosition !== null) {
      lines.push(`Queue Position: ${queuePosition}`);
    }
    
    if (estimatedWait > 0) {
      lines.push(`Estimated Wait: ${formatDuration(estimatedWait)}`);
    }
    
    lines.push(`Time Issued: ${new Date(ticket.created_at).toLocaleTimeString()}`);
    lines.push('');
    lines.push('--------------------------------');
    
    // Footer
    if (branding.ticket_header_text) {
      lines.push('');
      lines.push(center(branding.ticket_header_text));
    }
    if (branding.ticket_footer_text) {
      lines.push(center(branding.ticket_footer_text));
    }
    
    lines.push('');
    lines.push('');
    lines.push('');
    
    return lines.join('\n');
  };

  // Print via RawBT (Android)
  const printViaRawBT = () => {
    try {
      const ticketText = generateRawBTTicket();
      
      console.log('📱 Printing via RawBT...');
      console.log('📱 Ticket text:', ticketText);
      console.log('📱 Ticket length:', ticketText.length, 'characters');
      
      // RawBT format: rawbt:base64,<base64_encoded_text>
      // The 'base64,' prefix tells RawBT to decode the data before printing
      const base64Text = btoa(unescape(encodeURIComponent(ticketText)));
      const rawbtUrl = `rawbt:base64,${base64Text}`;
      
      console.log('📱 RawBT URL (with base64 prefix):', rawbtUrl.substring(0, 50) + '...');
      console.log('📱 Original ticket text:', ticketText);
      console.log('📱 Base64 length:', base64Text.length, 'characters');
      
      // Alternative method: Direct link click instead of window.location
      const printLink = document.createElement('a');
      printLink.href = rawbtUrl;
      printLink.click();
      
      toast.success('Print job sent to RawBT!', {
        description: 'Ticket should print automatically'
      });
      
    } catch (error) {
      console.error('RawBT print error:', error);
      toast.error('Print failed', {
        description: 'Make sure RawBT app is installed and printer is connected. Check device settings and try again.'
      });
    }
  };

  // Print handler function - creates a print window with the ticket (Browser/Laptop)
  const handleBrowserPrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const ticketHTML = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Ticket</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 10px;
              background: white;
            }
            .ticket-container {
              max-width: 350px;
              margin: 0 auto;
              border: 4px solid ${branding.ticket_border_color};
              border-radius: 8px;
              padding: 20px;
              background: white;
            }
            /* Header Section */
            .border-b-2 {
              border-bottom: 2px dashed #d1d5db;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .text-center {
              text-align: center;
            }
            img {
              height: 40px !important;
              width: auto !important;
              max-width: 120px !important;
              margin: 0 auto 8px !important;
              display: block !important;
              object-fit: contain !important;
            }
            h3 {
              font-size: 18px !important;
              font-weight: 600 !important;
              color: #374151 !important;
              margin: 0 0 4px 0 !important;
            }
            .text-sm {
              font-size: 12px !important;
              color: #6b7280 !important;
            }
            /* Ticket Number Section */
            .my-6 {
              margin: 16px 0 !important;
            }
            .text-base {
              font-size: 14px !important;
              font-weight: 500 !important;
              color: #4b5563 !important;
              margin-bottom: 6px !important;
            }
            .text-6xl {
              font-size: 56px !important;
              font-weight: bold !important;
              color: ${branding.primary_color} !important;
              line-height: 1 !important;
              margin: 8px 0 !important;
            }
            /* Service Info Section */
            .border-t-2 {
              border-top: 2px dashed #d1d5db;
              padding-top: 12px;
              margin-top: 12px;
            }
            .space-y-3 > div {
              margin-bottom: 8px;
            }
            .flex {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .text-gray-600 {
              color: #4b5563;
              font-size: 13px;
            }
            .font-semibold {
              font-weight: 600;
              color: #111827;
              font-size: 13px;
            }
            /* Footer Section */
            .mt-3 {
              margin-top: 10px;
            }
            .space-y-0\\.5 > p {
              margin-bottom: 2px;
            }
            .text-xs {
              font-size: 11px;
            }
            .text-gray-700 {
              color: #374151;
              font-weight: 500;
            }
            .text-gray-500 {
              color: #6b7280;
            }
            @media print {
              body {
                padding: 5px;
              }
              @page {
                margin: 8mm;
                size: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            ${ticketHTML}
          </div>
          <script>
            window.onload = function() {
              // Trigger print immediately when window loads
              window.print();
              // Close after printing
              setTimeout(function() {
                window.close();
              }, 100);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // Universal print handler - detects device and uses appropriate method
  const handlePrint = () => {
    if (isAndroid) {
      handleBrowserPrint();
    } else {
      handleBrowserPrint();
    }
  };

useEffect(() => {
  async function fetchQueueInfo() {
    // For now, set a default position
    // In a real implementation, you'd fetch all tickets and calculate position
    setQueuePosition(1);
    const waitTime = calculateWaitTime(1, ticket.service?.avg_service_time || 300);
    setEstimatedWait(waitTime);
  }

  fetchQueueInfo();
}, [ticket]);

// Auto-print ticket when component mounts and queue data is loaded
useEffect(() => {
  // Only auto-print when we have queue position data (means ticket is fully loaded)
  if (queuePosition !== null) {
    const printTimer = setTimeout(() => {
      if (isAndroid) {
        console.log('📱 Auto-printing via RawBT (Android)...');
      } else {
        console.log('🖨️ Auto-opening print dialog (Browser)...');
      }
      handlePrint();
    }, 100); // Ultra-fast printing - minimum safe delay

    return () => clearTimeout(printTimer);
  }
}, [queuePosition]); // Trigger when queue position is loaded

useEffect(() => {
  // Auto-reset after 15 seconds
  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        onReset();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [onReset]);

  return (
    <div className="mx-auto max-w-lg px-4">
      <div className="mb-4 text-center print:hidden">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          Ticket Created Successfully.
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Please keep your ticket and wait for your number to be called.
        </p>
      </div>

      <Card 
        className="mb-4 border-4 shadow-2xl print:w-full print:h-full print:fixed print:top-0 print:left-0" 
        style={{ borderColor: branding.ticket_border_color }}
        ref={printRef}
      >
        <CardContent className="p-6">
          {/* Ticket Header */}
          <div className="border-b-2 border-dashed pb-4 text-center">
            {branding.show_logo_on_ticket && branding.logo_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={branding.logo_url}
                alt="Company Logo"
                className="h-14 w-auto mx-auto mb-3 object-contain"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-700">
              {branding.company_name}
            </h3>
            <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
          </div>

          {/* Ticket Number */}
          <div className="my-6 text-center">
            <p className="text-base font-medium text-gray-600">Your Ticket Number</p>
            <p 
              className="mt-2 text-6xl font-bold"
              style={{ color: branding.primary_color }}
            >
              {ticket.ticket_number}
            </p>
          </div>

          {/* Service Info */}
          <div className="space-y-3 border-t-2 border-dashed pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-semibold">{ticket.service?.name}</span>
            </div>

            {queuePosition !== null && (
              <div className="flex justify-between">
                <span className="text-gray-600">Queue Position:</span>
                <span className="font-semibold">{queuePosition}</span>
              </div>
            )}

            {estimatedWait > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Wait:</span>
                <span className="font-semibold">{formatDuration(estimatedWait)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Time Issued:</span>
              <span className="font-semibold">
                {new Date(ticket.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Custom Footer Text */}
          <div className="mt-3 text-center space-y-0.5">
            <p className="text-xs text-gray-700 font-medium">{branding.ticket_header_text}</p>
            <p className="text-xs text-gray-500">{branding.ticket_footer_text}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid gap-3 sm:grid-cols-2 print:hidden">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="h-12"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Ticket.
        </Button>

        <Button
          onClick={onReset}
          className="h-12"
        >
          <Home className="mr-2 h-4 w-4" />
          Done ({countdown}s)
        </Button>
      </div>
    </div>
  );
}