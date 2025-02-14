import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Update when backend is set up

// Initialize the socket connection
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// Connect to the socket server
export const connectSocket = (userId) => {
  socket.auth = { userId };
  socket.connect();
};

// Disconnect from the socket server
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Listen for incoming video chat requests
export const onIncomingCall = (callback) => {
  socket.on('incoming-call', callback);
};

// Emit a video call request
export const startVideoCall = (peerId) => {
  socket.emit('start-call', { peerId });
};
