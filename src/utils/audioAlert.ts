/**
 * Audio Alarm System for New Orders
 * Rings continuously using Web Audio API until merchant clicks "جاري التجهيز"
 */

class OrderAudioManager {
  private audioCtx: AudioContext | null = null;
  private intervalId: number | null = null;
  private isAlarmPlaying: boolean = false;

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch (e) {
      console.warn('AudioContext not allowed or supported', e);
      return null;
    }
  }

  // Plays a single chime chord
  private playChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Melody notes: E5 (659.25Hz), G#5 (830.61Hz), B5 (987.77Hz), E6 (1318.51Hz)
      const notes = [
        { freq: 659.25, time: 0, duration: 0.18 },
        { freq: 830.61, time: 0.15, duration: 0.18 },
        { freq: 987.77, time: 0.30, duration: 0.22 },
        { freq: 1318.51, time: 0.45, duration: 0.45 },
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(0, now + note.time);
        gain.gain.linearRampToValueAtTime(0.28, now + note.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.duration);
      });
    } catch (e) {
      console.warn('Error playing audio chime', e);
    }
  }

  /**
   * Start looping alarm
   */
  public startAlarm() {
    if (this.isAlarmPlaying) return;
    this.isAlarmPlaying = true;

    // Play immediately
    this.playChime();

    // Repeat every 1.4 seconds
    this.intervalId = window.setInterval(() => {
      if (this.isAlarmPlaying) {
        this.playChime();
      }
    }, 1400);
  }

  /**
   * Stop looping alarm immediately
   */
  public stopAlarm() {
    this.isAlarmPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public isPlaying(): boolean {
    return this.isAlarmPlaying;
  }

  /**
   * Play single preview beep
   */
  public playPreview() {
    this.playChime();
  }
}

export const orderAudio = new OrderAudioManager();
