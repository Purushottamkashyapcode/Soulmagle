import React, { useState } from 'react';

const interestsList = ['Technology', 'Music', 'Gaming', 'Movies', 'Travel', 'Fitness'];

const InterestSelector = ({ onSelectInterests }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <h2 className="text-3xl font-bold text-white mb-4">Select Your Interests</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {interestsList.map((interest, index) => (
          <button
            key={index}
            onClick={() => toggleInterest(interest)}
            className={`px-4 py-2 rounded-full border-2 ${
              selectedInterests.includes(interest)
                ? 'bg-white text-blue-600 border-white'
                : 'bg-transparent text-white border-white'
            } transition hover:bg-white hover:text-blue-600`}
          >
            {interest}
          </button>
        ))}
      </div>

      <button
        onClick={() => onSelectInterests(selectedInterests)}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition"
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default InterestSelector;
