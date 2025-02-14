// controllers/chat.controller.js
import Chat from '../models/chat.model.js';

export const createChat = async (req, res) => {
  try {
    const newChat = new Chat({
      participants: req.body.participants,
      messages: []
    });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chats' });
  }
};
