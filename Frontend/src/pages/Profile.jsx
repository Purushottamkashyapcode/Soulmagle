import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserInterests } from "../services/api";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newInterest, setNewInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    setLoading(true);
    try {
      const userData = await getUserProfile(token);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    setLoading(false);
  };

  const handleAddInterest = () => {
    if (newInterest.trim() !== "" && !user.interests.includes(newInterest)) {
      const updatedInterests = [...user.interests, newInterest];
      updateInterests(updatedInterests);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    const updatedInterests = user.interests.filter(
      (interest) => interest !== interestToRemove
    );
    updateInterests(updatedInterests);
  };

  const updateInterests = async (updatedInterests) => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = await updateUserInterests(token, updatedInterests);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating interests:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-600 h-24 w-24"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white p-10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900 opacity-80"></div>
      <div className="absolute top-10 left-10 h-40 w-40 bg-blue-500 rounded-full opacity-25 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-52 w-52 bg-red-500 rounded-full opacity-25 blur-3xl"></div>

      {/* Profile Card */}
      <div className="relative z-10 w-full max-w-3xl bg-opacity-30 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-700">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Profile
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-transform hover:scale-105"
          >
            <LogOut className="mr-2" size={22} />
            Logout
          </button>
        </div>

        {/* User Information */}
        {user && (
          <>
            <div className="mb-8 text-center">
              <p className="text-2xl font-bold text-gray-300">Welcome,</p>
              <p className="text-4xl font-extrabold text-blue-300">{user.username}</p>
              <p className="text-gray-400 text-lg mt-2">{user.email}</p>
            </div>

            {/* Interests Section */}
            <div className="mb-8">
              <p className="text-xl font-semibold text-gray-300 mb-4">
                Your Interests:
              </p>
              <div className="flex flex-wrap gap-3">
                {user.interests.length > 0 ? (
                  user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-4 py-2 rounded-full flex items-center shadow-lg border border-gray-600"
                    >
                      {interest}
                      <Trash2
                        size={16}
                        className="ml-2 cursor-pointer hover:text-red-400 transition"
                        onClick={() => handleRemoveInterest(interest)}
                      />
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No interests added yet.</p>
                )}
              </div>
            </div>

            {/* Add Interest Section */}
            <div className="flex items-center gap-4 justify-center">
              <input
                type="text"
                placeholder="Add new interest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="w-2/3 px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                onClick={handleAddInterest}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-3 rounded-full hover:scale-110 transition-transform"
              >
                <Plus size={28} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
