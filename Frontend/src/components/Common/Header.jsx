import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle2, Video, Home, LogOut } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const navigate = useNavigate();
  const { onlineUsers } = useSocket();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  // Check login status and decode JWT token to get username
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, [isLoggedIn]);

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black shadow-xl fixed w-full top-0 left-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500 hover:scale-105 transition-transform">
          SoulMagle
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-6 items-center">
          <Link to="/" className="flex items-center gap-1 text-gray-300 hover:text-blue-400 transition-transform hover:scale-110">
            <Home size={22} />
            Home
          </Link>
          <Link to="/video-chat" className="flex items-center gap-1 text-gray-300 hover:text-red-400 transition-transform hover:scale-110">
            <Video size={22} />
            Video Chat
          </Link>
          {isLoggedIn && (
            <Link to="/profile" className="flex items-center gap-1 text-gray-300 hover:text-gray-400 transition-transform hover:scale-110">
              <UserCircle2 size={22} />
              Profile
            </Link>
          )}
        </nav>

        {/* Authentication & Online Users */}
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 hidden sm:block">
                Welcome, <span className="text-blue-400 font-semibold">{username}</span>!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-transform hover:scale-105 hover:shadow-red-500/50"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-transform hover:scale-105 hover:shadow-blue-500/50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-lg hover:bg-gray-900 transition-transform hover:scale-105 hover:shadow-gray-500/50"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Online Users Indicator */}
          <div className="flex items-center gap-2 text-white ml-4">
            <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">{onlineUsers} Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
