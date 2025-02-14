import Video from '../models/video.model.js';

// Upload a new video
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const newVideo = new Video({
      title,
      description,
      url,
      uploadedBy: req.user.id,
    });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

// Retrieve all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'username');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
};

// Retrieve a specific video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploadedBy', 'username');
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve video' });
  }
};

// Delete a specific video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this video' });
    }
    await video.remove();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

// Start a video call (Placeholder for WebRTC/Socket.io logic)
export const startVideoCall = (req, res) => {
  // Add WebRTC or Socket.io signaling logic here
  res.status(200).json({ message: 'Video call started' });
};

// End a video call (Placeholder for WebRTC/Socket.io logic)
export const endVideoCall = (req, res) => {
  // Add logic to clean up the call session here
  res.status(200).json({ message: 'Video call ended' });
};
