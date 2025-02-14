import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import VideoChat from './components/Chat/VideoChat';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import { SocketProvider } from './context/SocketContext';

const App = () => {
  return (
    <SocketProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-16"> {/* Add padding to avoid overlap with fixed header */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/video-chat" element={<VideoChat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <Footer /> {/* Footer displayed at the bottom */}
      </div>
    </SocketProvider>
  );
};

export default App;
