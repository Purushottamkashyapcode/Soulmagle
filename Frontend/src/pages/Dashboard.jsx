import React, { useState } from 'react';
import { findMatch } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowRightCircle, Loader, Users } from 'lucide-react';

const Dashboard = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFindMatch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');  
      const matchedUser = await findMatch(token);  

      if (matchedUser) {
        setMatch(matchedUser);
        setTimeout(() => {
          navigate('/video-chat', { state: { matchedUserId: matchedUser.id } });
        }, 1500);
      } else {
        alert('No matches found. Try again later!');
      }
    } catch (error) {
      console.error('Error finding a match:', error);
      alert('Error finding a match');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative p-6">
      
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-80"></div>

      {/* Floating Neon Lights */}
      <div className="absolute top-10 left-10 h-40 w-40 bg-blue-500 rounded-full opacity-25 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-40 w-40 bg-red-500 rounded-full opacity-25 blur-3xl"></div>

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-300 mb-8 relative z-10 animate-fade-in">
        Find Your Match 💙
      </h1>

      {/* Find Match Button */}
      <button
        onClick={handleFindMatch}
        className={`px-10 py-4 text-lg font-semibold rounded-full flex items-center gap-3 transition-transform duration-300 relative z-10
        ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'} 
        text-white shadow-lg`}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="animate-spin" size={20} />
            Finding Match...
          </>
        ) : (
          <>
            <Users size={22} />
            Find Match
          </>
        )}
      </button>

      {/* Loading Animation */}
      {loading && (
        <div className="mt-6 animate-spin rounded-full h-16 w-16 border-b-4 border-white relative z-10"></div>
      )}

      {/* Match Found Section */}
      {match && (
        <div className="mt-10 p-6 w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl shadow-lg text-center transition-transform duration-500 hover:scale-105 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">🎉 Match Found!</h2>
          <p className="text-gray-300">
            <span className="font-semibold">{match.username}</span>
          </p>
          <p className="text-gray-400 mt-2">
            Interests: <span className="text-cyan-300">{match.interests.join(', ')}</span>
          </p>

          {/* Start Chat Button */}
          <button
            onClick={() => navigate('/video-chat', { state: { matchedUserId: match.id } })}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full flex items-center gap-2 hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            <ArrowRightCircle size={22} />
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
