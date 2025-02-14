import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const quotes = [
  "Every great connection begins with a simple hello.",
  "Your soulmate is out there. Let’s find them!",
  "A true connection doesn’t need perfection, just authenticity.",
  "One conversation can change everything.",
  "Some people arrive and make such a beautiful impact on your life."
];

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white relative">
      
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-80"></div>

      {/* Floating Neon Circle Effect */}
      <div className="absolute top-10 left-10 h-32 w-32 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-40 w-40 bg-red-500 rounded-full opacity-20 blur-3xl"></div>

      {/* Branding */}
      <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-300 animate-fade-in relative z-10">
        SoulMagle
      </h1>

      {/* Display Quote if Logged In */}
      {isLoggedIn ? (
        <>
          <p className="text-lg italic text-gray-400 mb-6 max-w-lg text-center animate-fade-in relative z-10">
            "{quote}"
          </p>
          <h2 className="text-2xl font-semibold mb-6 relative z-10">
            Welcome back, <span className="text-cyan-300">{username}</span>!
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-10 py-4 mt-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-transform hover:shadow-blue-500/50 relative z-10"
          >
            Find Your Soulmate 💙
          </button>
        </>
      ) : (
        <>
          <p className="text-lg mb-8 text-center max-w-xl text-gray-400 animate-fade-in relative z-10">
            Discover meaningful connections and meet your perfect match!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10">
            <Link
              to="/signup"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-xl text-lg font-semibold shadow-md hover:scale-105 transition-transform hover:shadow-cyan-500/50"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-lg font-semibold text-white hover:bg-gray-700 transition-transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
