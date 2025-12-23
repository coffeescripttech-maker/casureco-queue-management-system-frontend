'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, Volume2 } from 'lucide-react';
import { useRealtimeTickets } from '@/lib/hooks/use-realtime-tickets';
import { useRealtimeCounters } from '@/lib/hooks/use-realtime-counters';
import { DisplayHeader } from '@/components/display/display-header';
import { QueueList } from '@/components/display/queue-list';
import { VideoArea } from '@/components/display/video-area';
import { ScrollingTicker } from '@/components/display/scrolling-ticker';
import { CompactWaitingList } from '@/components/display/compact-waiting-list';
import { useTicketAnnouncements } from '@/lib/hooks/use-ticket-announcements';
import apiClient from '@/lib/api/client';
import { Button } from '@/components/ui/button';

export default function DisplayPage() {
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  // Initialize branchId from URL or localStorage
  const [branchId, setBranchId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const urlBranchId = params.get('branch') || localStorage.getItem('display_branch_id');
    return urlBranchId || '071aa7e0-d588-11f0-93ae-088fc3019fcf';
  });

  useEffect(() => {
    // Check maintenance mode first
    checkMaintenanceMode();
    
    // Save to localStorage when branchId changes
    if (branchId) {
      localStorage.setItem('display_branch_id', branchId);
    }
    
    // Check if audio was previously enabled
    const wasEnabled = localStorage.getItem('audio_enabled') === 'true';
    setAudioEnabled(wasEnabled);
  }, [branchId]);

  async function checkMaintenanceMode() {
    try {
      const { data } = await apiClient.get<{ settings: { maintenance_mode?: boolean } }>(
        '/settings/system'
      );
      if (data.settings?.maintenance_mode) {
        router.push('/maintenance');
      }
    } catch (error) {
      // Ignore errors - display page should work even if settings API fails
      console.log('Could not check maintenance mode:', error);
    }
  }

  function enableAudio() {
    // Initialize audio context properly
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Resume if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Play a test beep + speech to unlock everything
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.value = 0.2;
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    const now = audioContext.currentTime;
    oscillator.start(now);
    oscillator.stop(now + 0.1);
    
    // Also try speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Audio enabled');
      utterance.volume = 0.5;
      window.speechSynthesis.speak(utterance);
    }
    
    // Enable immediately
    setAudioEnabled(true);
    localStorage.setItem('audio_enabled', 'true');
    console.log('🔊 Audio unlocked - Context state:', audioContext.state);
    
    // Force a small delay to ensure audio context is ready
    setTimeout(() => {
      console.log('🔊 Audio ready for announcements');
    }, 500);
  }

  const { tickets } = useRealtimeTickets({
    branchId,
  });

  const { counters, loading: countersLoading } = useRealtimeCounters(branchId);

  // Call all hooks before any conditional returns (Rules of Hooks)
  useTicketAnnouncements(tickets, audioEnabled);

  if (!branchId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Monitor className="h-12 w-12 animate-pulse text-gray-400" />
      </div>
    );
  }

  // Filter tickets for different sections
  const servingTickets = tickets.filter((t) => t.status === 'serving');
  const waitingTickets = tickets.filter((t) => t.status === 'waiting');
  
  console.log(' Display - Total tickets:', tickets.length, 'Serving:', servingTickets.length, 'Waiting:', waitingTickets.length);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Audio Enable Overlay */}
      {!audioEnabled && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Volume2 className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enable Audio Announcements</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to enable voice announcements for ticket calls.
            </p>
            <Button
              size="lg"
              onClick={enableAudio}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Enable Audio
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <DisplayHeader />
      
      {/* Main Split Screen Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel - Queue List (35% width) */}
        <div className="w-[35%] overflow-y-auto border-r border-gray-200 bg-white/50 p-6 backdrop-blur-sm">
          <QueueList 
            tickets={servingTickets} 
            counters={counters} 
            loading={countersLoading}
          />
        </div>
        
        {/* Right Panel - Video Area + Waiting List (65% width) */}
        <div className="flex-1 flex flex-col p-1">
          <div className="flex-1 min-h-0">
            <VideoArea branchId={branchId} />
          </div>
          <CompactWaitingList tickets={waitingTickets} />
        </div>
      </main>
      
      {/* Bottom Ticker */}
      <ScrollingTicker branchId={branchId} />
      
      {/* Audio Status Indicator */}
      {audioEnabled && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg">
          <Volume2 className="h-4 w-4" />
          Audio Enabled
        </div>
      )}
    </div>
  );
}