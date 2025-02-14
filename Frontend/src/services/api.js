import axios from 'axios';

const API_URL = 'http://localhost:5000/api';  // Update this when deploying

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API calls
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Login failed');
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Signup failed');
  }
};

// Fetch user profile
export const getUserProfile = async (token) => {
  try {
    const response = await api.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};

// Update user interests
export const updateUserInterests = async (token, interests) => {
  try {
    const response = await api.put(
      '/users/profile',
      { interests },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.user;
  } catch (error) {
    throw new Error('Failed to update interests');
  }
};

// Find a user with matching interests
export const findMatch = async (token) => {
  try {
    const response = await api.post(
      '/users/find-match',  // Backend route for finding matches
      {},  // No need to send interests; fetched directly from user data
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.match;  // Backend returns a single match now
  } catch (error) {
    throw new Error(error.response.data.message || 'Failed to find match');
  }
};
