import { useEffect } from 'react';
import socketService from '../services/SocketService';

export default function useSocketMessages(userId, onNewMessageCallback) {
  useEffect(() => {
    if (!userId) return;

    socketService.connect(userId);

    socketService.onNewMessage((messageData) => {
      console.log('Received new_message:', messageData);

      onNewMessageCallback(messageData);
    });

    return () => {
      socketService.offNewMessage();
      socketService.disconnect();
    };
  }, [userId, onNewMessageCallback]);
}