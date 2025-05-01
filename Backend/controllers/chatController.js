const Message = require("../models/messageModel");

exports.sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
  
    // Log received data
    console.log("Received Data: ", { receiverId, content });
  
    try {
      // Check if user is authenticated (to make sure req.user.id exists)
      console.log("Sender ID from token:", req.user.id);
  
      // Attempt to create the message
      const message = await Message.create({
        sender: req.user.id, // Sender ID comes from the authenticated user
        receiver: receiverId,
        content,
      });
  
      // Log success and response data
      console.log("Message sent successfully:", message);
  
      res.status(201).json({ success: true, message });
    } catch (err) {
      // Log the error for debugging
      console.error("Error while sending message:", err);
  
      res.status(500).json({ success: false, error: "Failed to send message." });
    }
  };
  

exports.getMessages = async (req, res) => {
  const otherUserId = req.params.userId;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch messages." });
  }
};
