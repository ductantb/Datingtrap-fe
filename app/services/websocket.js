// services/WebSocketService.js
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageQueue = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  connect(userId, onConnectionChange = null) {
    return new Promise((resolve, reject) => {
      try {
        // Replace with your actual backend URL
        const socket = new SockJS('http://192.168.1.5:8080/ws');
        this.stompClient = Stomp.over(socket);
        
        // Disable debug logs in production
        this.stompClient.debug = (str) => {
          console.log('STOMP: ' + str);
        };

        this.stompClient.connect(
          {},
          (frame) => {
            console.log('Connected to WebSocket: ' + frame);
            this.connected = true;
            this.reconnectAttempts = 0;
            
            // Process queued messages
            this.processMessageQueue();
            
            if (onConnectionChange) {
              onConnectionChange(true);
            }
            
            resolve(frame);
          },
          (error) => {
            console.error('WebSocket connection error:', error);
            this.connected = false;
            
            if (onConnectionChange) {
              onConnectionChange(false);
            }
            
            // Attempt to reconnect
            this.attemptReconnect(userId, onConnectionChange);
            
            reject(error);
          }
        );
      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  attemptReconnect(userId, onConnectionChange) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(userId, onConnectionChange);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      
      this.stompClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
      this.connected = false;
    }
  }

  subscribeToMessages(callback) {
    if (!this.connected || !this.stompClient) {
      console.warn('WebSocket not connected, cannot subscribe to messages');
      return null;
    }

    const subscription = this.stompClient.subscribe('/topic/messages', (message) => {
      try {
        const messageData = JSON.parse(message.body);
        callback(messageData);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.subscriptions.set('messages', subscription);
    return subscription;
  }

  subscribeToMatchUpdates(userId, callback) {
    if (!this.connected || !this.stompClient) {
      console.warn('WebSocket not connected, cannot subscribe to match updates');
      return null;
    }

    const topic = `/topic/match.update.${userId}`;
    const subscription = this.stompClient.subscribe(topic, (message) => {
      try {
        const updateData = JSON.parse(message.body);
        callback(updateData);
      } catch (error) {
        console.error('Error parsing match update:', error);
      }
    });

    this.subscriptions.set(`match-updates-${userId}`, subscription);
    return subscription;
  }

  sendMessage(messageData) {
    if (!this.connected || !this.stompClient) {
      console.warn('WebSocket not connected, queueing message');
      this.messageQueue.push(messageData);
      return;
    }

    try {
      this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(messageData));
    } catch (error) {
      console.error('Error sending message:', error);
      // Queue the message for retry
      this.messageQueue.push(messageData);
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;