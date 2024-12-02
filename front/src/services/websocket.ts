// src/services/websocket.ts
type SensorData = {
  timestamp: number;
  temperature: number;
  humidity: number;
};

class WebSocketService {
  private socket: WebSocket | null;
  private callbacks: Array<(data: SensorData) => void>;
  private reconnectInterval: number;

  constructor() {
    this.socket = null;
    this.callbacks = [];
    this.reconnectInterval = 5000; // 5 segundos
  }

  connect() {
    const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000';
    this.socket = new WebSocket(WEBSOCKET_URL);

    this.socket.onopen = () => {
      console.log('WebSocket conectado');
    };

    this.socket.onmessage = (event) => {
      try {
        const data: SensorData = JSON.parse(event.data);
        console.log('WebSocket data received:', data); // Añadido para depuración
        this.callbacks.forEach((cb) => cb(data));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket desconectado. Intentando reconectar...');
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.socket?.close();
    };
  }

  onData(callback: (data: SensorData) => void) {
    this.callbacks.push(callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();
