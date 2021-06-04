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
    console.log('url: ', url);
    if (!url) return;
    if (!enabled) return;
    const socket = sockerIo(`${url}/comment`, {
      path: '/socket-io/',
      transports: ['websocket']
    });

    socket.emit('join-room', { type: roomType, roomId });
    socket.on('connect', () => {
      console.log('socket connected');
      if (onConnected) onConnected();
    });

    socket.on('disconnect', () => {
      console.log('disconnect socket');
      return;
    });

    socket.on('reconnect', () => {
      console.log('reconnect socket');
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

export function useSocketNotification(args: {
  url?: string;
  enabled?: boolean;
  userId?: string;
  onConnected?: () => void;
}) {
  const { enabled = true, userId = '', onConnected = () => { }, url = '' } = args;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log('url: ', url);
    if (!url) return;
    if (!enabled) return;
    if (!userId) return;
    const socket = sockerIo(`${url}/notification`, {
      path: '/socket-io/',
      transports: ['websocket']
    });

    socket.emit('join-room', { userId });
    socket.on('connect', () => {
      console.log('socket connected');
      if (onConnected) onConnected();
    });

    socket.on('disconnect', () => {
      console.log('disconnect socket');
      return;
    });

    socket.on('reconnect', () => {
      console.log('reconnect socket');
      socket.emit('join-room', { type: userId });
    });

    setSocket(socket);

    return () => { socket.disconnect(); };
  }, [enabled]);
  return {
    socket, leaveRoom: () => {
      if (socket) {
        socket.emit('leave-room', { userId });
      }
    }
  };
}