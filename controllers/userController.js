const User = require("../models/User");
exports.getRandomUsers = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user.id);
    if (!loggedInUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const oppositeGender = loggedInUser.gender === "male" ? "female" : "male";
    const users = await User.aggregate([
      { $match: { gender: oppositeGender } },
      { $sample: { size: 10 } },
    ]);
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getProfile= async(req,res)=>{
  try {
    const user = await User.findById(req.user).select('-password')
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });

  }
}

exports.updateProfile=async(req,res)=>{
  try {
    const { name, gender } = req.body;

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (name) user.name = name;
    if (gender) user.gender = gender;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });

  }
}

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    res.json({ message: "Profile picture uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.likeUser = async (req, res) => {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ message: "Target user ID is required" });
  }

  try {
    const user = await User.findById(req.user.id); 
    const targetUser = await User.findById(targetUserId); 

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    
    if (user.likes.includes(targetUserId)) {
      return res.status(400).json({ message: "You already liked this user" });
    }


    user.likes.push(targetUserId);
    await user.save();

    
    if (targetUser.likes.includes(req.user.id)) {
      
      user.matches.push(targetUserId);
      targetUser.matches.push(req.user.id);
      await user.save();
      await targetUser.save();

      return res.status(200).json({ message: "Match found!" });
    }

    res.status(200).json({ message: "User liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

