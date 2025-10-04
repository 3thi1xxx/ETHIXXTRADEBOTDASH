// FIX: Create the event hub for real-time data streaming.
import { HubStatus } from '../types';
import { EVENTS_ENDPOINT } from '../constants';

type Subscriber = (event: any) => void;
type StatusCallback = (status: HubStatus) => void;

class Hub {
  private eventSource: EventSource | null = null;
  private subscribers: Set<Subscriber> = new Set();
  private statusCallback: StatusCallback | null = null;
  // FIX: In a browser environment, setTimeout returns a number, not a NodeJS.Timeout.
  private reconnectTimeout: number | null = null;
  // FIX: In a browser environment, setInterval returns a number, not a NodeJS.Timeout.
  private mockInterval: number | null = null;

  start(statusCallback: StatusCallback) {
    this.statusCallback = statusCallback;
    this.connect();

    // Start mock data emitter if connection fails
    setTimeout(() => {
        if (this.eventSource?.readyState !== EventSource.OPEN) {
            console.warn("EventSource connection failed, starting mock data emitter.");
            this.statusCallback?.(HubStatus.DEGRADED); // Indicate mock data
            this.startMockEmitter();
        }
    }, 3000);
  }

  stop() {
    this.eventSource?.close();
    this.eventSource = null;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
     if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    this.statusCallback?.(HubStatus.DISCONNECTED);
  }

  subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
  }

  unsubscribe(callback: Subscriber) {
    this.subscribers.delete(callback);
  }

  private connect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
    this.statusCallback?.(HubStatus.CONNECTING);
    this.eventSource = new EventSource(EVENTS_ENDPOINT);

    this.eventSource.onopen = () => {
      this.statusCallback?.(HubStatus.CONNECTED);
       if (this.mockInterval) { // Stop mock emitter if real connection succeeds
          clearInterval(this.mockInterval);
          this.mockInterval = null;
      }
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.subscribers.forEach((callback) => callback(data));
      } catch (error) {
        console.error('Failed to parse event data:', error);
      }
    };

    this.eventSource.onerror = () => {
      this.statusCallback?.(HubStatus.DISCONNECTED);
      this.eventSource?.close();
      // Simple reconnect logic
      if (!this.reconnectTimeout) {
        this.reconnectTimeout = setTimeout(() => {
          this.reconnectTimeout = null;
          this.connect();
        }, 5000);
      }
    };
  }
  
  private startMockEmitter() {
      if (this.mockInterval) return;
      
      this.mockInterval = setInterval(() => {
          const mockEvent = {
              type: 'LOG',
              payload: {
                  ts: Date.now(),
                  level: 'INFO',
                  msg: `Mock event generated at ${new Date().toLocaleTimeString()}`
              }
          };
          this.subscribers.forEach(s => s(mockEvent));
      }, 5000);
  }
}

export const hub = new Hub();