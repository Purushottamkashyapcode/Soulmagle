import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket, connectSocket, disconnectSocket, onIncomingCall, startVideoCall } from '../services/socket';
import { jwtDecode } from 'jwt-decode';
 // ✅ Fix incorrect import (use default import)

// Create a Context
const SocketContext = createContext();

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);

// Provider component to wrap around the app
export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0); // Track online users
  const [userId, setUserId] = useState('guest'); // Default user ID

  useEffect(() => {
    // Get user ID from JWT token if available
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the JWT token
        setUserId(decodedToken.id || 'guest'); // Fallback to 'guest' if missing
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }

    // Connect the socket with the user ID
    connectSocket(userId);

    // Handle socket connection
    socket.on('connect', () => {
      console.log('✅ Connected to the socket server:', socket.id);
      setIsConnected(true);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
      setIsConnected(false);
    });

    // Listen for online user count updates from server
    socket.on('online-users', (count) => {
      console.log('👥 Online users:', count);
      setOnlineUsers(count);
    });

    // Listen for incoming calls
    onIncomingCall((data) => {
      console.log('📞 Incoming call from:', data);
      setIncomingCall(data);
    });

    // Cleanup function on component unmount
    return () => {
      disconnectSocket();
    };
  }, [userId]); // Re-run effect when `userId` changes

  return (
    <SocketContext.Provider value={{ socket, isConnected, incomingCall, onlineUsers, startVideoCall }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
