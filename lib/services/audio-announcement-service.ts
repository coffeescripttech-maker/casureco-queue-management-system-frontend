/**
 * Audio Announcement Service
 * Alternative to browser TTS - uses HTML5 Audio with pre-generated or dynamic audio
 */

class AudioAnnouncementService {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Initialize audio context (call this on user interaction)
   */
  async initialize(): Promise<void> {
    if (!this.audioContext) return;
    
    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    console.log('🔊 Audio: Context initialized');
  }

  /**
   * Play announcement using HTML5 Audio
   */
  async playAnnouncement(ticketNumber: string, counterName: string): Promise<void> {
    if (!this.isEnabled) {
      console.log('🔊 Audio: Disabled');
      return;
    }

    try {
      // Option 1: Use browser TTS but with better error handling
      await this.playWithTTS(ticketNumber, counterName);
    } catch (error) {
      console.error('🔊 Audio: Failed to play:', error);
      // Fallback: Play a beep sound
      await this.playBeep();
    }
  }

  /**
   * Play using browser TTS (improved version)
   */
  private async playWithTTS(ticketNumber: string, counterName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('TTS not supported'));
        return;
      }

      const synth = window.speechSynthesis;
      
      // Cancel any ongoing speech
      synth.cancel();

      const text = `Ticket ${ticketNumber}, please proceed to ${counterName}`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        console.log('🔊 Audio: Played successfully');
        resolve();
      };

      utterance.onerror = (event) => {
        console.warn('🔊 Audio: TTS error:', event.error);
        reject(new Error(event.error));
      };

      console.log('🔊 Audio: Playing:', text);
      synth.speak(utterance);
    });
  }

  /**
   * Play a beep sound as fallback
   */
  private async playBeep(): Promise<void> {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Create a pleasant two-tone beep
    oscillator.frequency.value = 800; // Higher pitch
    gainNode.gain.value = 0.3;
    oscillator.type = 'sine';

    const now = this.audioContext.currentTime;
    oscillator.start(now);
    oscillator.stop(now + 0.1);

    // Second beep
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode2 = this.audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(this.audioContext.destination);
    
    oscillator2.frequency.value = 600; // Lower pitch
    gainNode2.gain.value = 0.3;
    oscillator2.type = 'sine';
    
    oscillator2.start(now + 0.15);
    oscillator2.stop(now + 0.25);

    console.log('🔊 Audio: Played beep (fallback)');
  }

  /**
   * Play a custom audio file
   */
  async playAudioFile(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      
      audio.onended = () => {
        console.log('🔊 Audio: File played successfully');
        resolve();
      };
      
      audio.onerror = (error) => {
        console.error('🔊 Audio: File error:', error);
        reject(error);
      };
      
      audio.play().catch(reject);
    });
  }

  /**
   * Enable/disable audio
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Stop all audio
   */
  stop(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioAnnouncementService = new AudioAnnouncementService();
