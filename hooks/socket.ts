import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import sockerIo, { Socket } from 'socket.io-client';
import { AppState } from '../redux/reducers';

export function useSocket(args: {
  url?: string;
  enabled?: boolean;
  roomType?: number;
  roomId?: string;
  onConnected?: () => void;
}) {
  const { enabled = true, roomId = '', roomType = 0, onConnected = () => { }, url = '' } = args;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!url) return;
    if (!enabled) return;
    const socket = sockerIo(url, {
      path: '/socket-io/',
      transports: ['websocket']
    });

    socket.emit('join-room', { type: roomType, roomId });
    socket.on('connect', () => {
      if (onConnected) onConnected();
    });

    socket.on('reconnect', () => {
      socket.emit('join-room', { type: roomType, roomId });
    });

    setSocket(socket);

    return () => { socket.disconnect(); };
  }, [enabled]);
  return {
    socket, leaveRoom: () => {
      if (socket) {
        socket.emit('leave-room', { type: roomType, roomId });
      }
    }
  };
}