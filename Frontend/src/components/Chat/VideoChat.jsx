import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { findMatch } from '../../services/api';
import { Send } from 'lucide-react';

const VideoChat = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatBoxRef = useRef(null);
  const peerConnection = useRef(null);

  const [remoteUserId, setRemoteUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState(localStorage.getItem('token'));

  const iceServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    if (!token) {
      alert('Please login to access video chat!');
      navigate('/login');
    } else {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          initializeChat();
        })
        .catch((err) => {
          console.error("Camera permission denied:", err);
          alert("Please allow camera & microphone access.");
        });
    }
  }, []);

  const initializeChat = async () => {
    try {
      const matchedUser = await findMatch(token);
      const roomId = `room-${matchedUser.id}`;

      setRemoteUserId(matchedUser.id);
      socket.emit('join-room', { roomId, userId: socket.id });

      console.log(`Joined room: ${roomId} with ${matchedUser.username}`);
    } catch (error) {
      console.error('No match found:', error);
      alert('No match found. Try again later.');
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('user-connected', (userId) => {
      console.log('User connected:', userId);
      setRemoteUserId(userId);
      startCall();
    });

    socket.on('offer', async ({ offer, from }) => {
      await handleOffer(offer, from);
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', ({ candidate }) => {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('user-disconnected', () => {
      console.log('User disconnected');
      endCall();
    });

    socket.on('chat-message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off('user-connected');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-disconnected');
      socket.off('chat-message');
    };
  }, [socket]);

  const startCall = async () => {
    setIsLoading(false);
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

    peerConnection.current = new RTCPeerConnection(iceServers);
    localStream.getTracks().forEach((track) => peerConnection.current.addTrack(track, localStream));

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && remoteUserId) {
        socket.emit('ice-candidate', { candidate: event.candidate, targetUserId: remoteUserId });
      }
    };

    if (remoteUserId) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', { offer, targetUserId: remoteUserId });
    }
  };

  const handleOffer = async (offer, from) => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

    peerConnection.current = new RTCPeerConnection(iceServers);
    localStream.getTracks().forEach((track) => peerConnection.current.addTrack(track, localStream));

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, targetUserId: from });
      }
    };

    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit('answer', { answer, targetUserId: from });
  };

  const endCall = () => {
    peerConnection.current?.close();
    setRemoteUserId(null);
    setIsLoading(true);
  };

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = { text: newMessage, sender: 'You' };
      socket.emit('chat-message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage('');
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Video Section - 60% */}
        <div className="w-full md:w-3/5 bg-gray-900 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3 text-center">Video Chat</h2>
          <div className="flex flex-col items-center gap-4">
            <video ref={localVideoRef} autoPlay muted className="w-full h-64 rounded-xl border-4 border-blue-500 shadow-xl" />
            {isLoading ? (
              <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
              </div>
            ) : (
              <video ref={remoteVideoRef} autoPlay className="w-full h-64 rounded-xl border-4 border-red-500 shadow-xl" />
            )}
          </div>
        </div>

        {/* Chat Section - 40% (Compact) */}
        <div className="w-full md:w-2/5 bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-3 text-center">Chat</h2>
          <div ref={chatBoxRef} className="h-40 overflow-y-auto p-2 text-gray-300 flex-grow">
            {messages.map((msg, index) => (
              <p key={index} className="text-sm">{msg.sender}: {msg.text}</p>
            ))}
          </div>
          {/* Input Box is now properly at bottom */}
          <div className="flex mt-2">
            <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-grow px-3 py-2 rounded-l-lg bg-gray-700 text-white text-sm" />
            <button onClick={sendMessage} className="px-3 bg-blue-600 rounded-r-lg text-white text-sm">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
