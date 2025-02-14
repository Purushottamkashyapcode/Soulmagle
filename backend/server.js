import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Ensure this matches your frontend URL
    methods: ['GET', 'POST']
  }
});

// Store users and their room associations
const users = {};

io.on('connection', (socket) => {
  console.log(`✅ New user connected: ${socket.id}`);

  // When a user joins a room
  socket.on('join-room', ({ roomId, userId }) => {
    console.log(`🔹 ${userId} joined room: ${roomId}`);
    socket.join(roomId);
    users[socket.id] = { userId, roomId };

    // Notify the other user in the room
    socket.to(roomId).emit('user-connected', { userId });
  });

  // ✅ Handle WebRTC Offer
  socket.on('offer', ({ offer, targetUserId }) => {
    console.log(`📡 Offer from ${socket.id} to ${targetUserId}`);
    io.to(targetUserId).emit('offer', { offer, from: socket.id });
  });

  // ✅ Handle WebRTC Answer
  socket.on('answer', ({ answer, targetUserId }) => {
    console.log(`✅ Answer from ${socket.id} to ${targetUserId}`);
    io.to(targetUserId).emit('answer', { answer, from: socket.id });
  });

  // ✅ Handle ICE Candidates
  socket.on('ice-candidate', ({ candidate, targetUserId }) => {
    console.log(`❄️ ICE candidate from ${socket.id} to ${targetUserId}`);
    io.to(targetUserId).emit('ice-candidate', { candidate, from: socket.id });
  });

  // 💬 Handle Chat Messages
  socket.on('chat-message', ({ message, sender }) => {
    const roomId = users[socket.id]?.roomId;
    if (roomId) {
      console.log(`💬 ${sender}: ${message}`);
      io.to(roomId).emit('chat-message', { sender, message });
    }
  });

  // ✍️ Handle Typing Indicator
  socket.on('typing', ({ sender }) => {
    const roomId = users[socket.id]?.roomId;
    if (roomId) {
      socket.to(roomId).emit('typing', { sender });
    }
  });

  // ❌ Handle User Disconnection
  socket.on('disconnect', () => {
    const roomId = users[socket.id]?.roomId;
    const userId = users[socket.id]?.userId;
    
    if (roomId) {
      console.log(`⛔ ${userId} disconnected from room: ${roomId}`);
      socket.to(roomId).emit('user-disconnected', userId);
    }

    delete users[socket.id];
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
