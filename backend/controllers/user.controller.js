import User from '../models/user.model.js';
import { Op } from 'sequelize';

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'interests'],  // Only send necessary fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);  // Send user profile to frontend
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// Find users with similar interests
export const findMatch = async (req, res) => {
  try {
    const currentUser = await User.findByPk(req.user.id);

    if (!currentUser || !currentUser.interests || currentUser.interests.length === 0) {
      return res.status(400).json({ message: 'No interests found for the user' });
    }

    const matches = await User.findAll({
      where: {
        interests: { [Op.overlap]: currentUser.interests },
        id: { [Op.ne]: req.user.id },
      },
      attributes: ['id', 'username', 'interests'],
      limit: 1,
    });

    if (matches.length === 0) {
      return res.status(404).json({ message: 'No matches found' });
    }

    res.status(200).json({ match: matches[0] });
  } catch (error) {
    console.error('Match Error:', error);
    res.status(500).json({ message: 'Server error while finding match' });
  }
};

// Update user interests
export const updateProfile = async (req, res) => {
  const { interests } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.interests = interests;
    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
