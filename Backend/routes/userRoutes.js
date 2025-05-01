const express = require('express');
const { getRandomUsers, getProfile, updateProfile, uploadProfilePicture, likeUser, getMatchedUsers } = require('../controllers/userController');
const { protect, authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');


const router = express.Router();

router.get('/random-users', protect, getRandomUsers);
router.get('/profile', authMiddleware, getProfile);
router.put('/update-profile', protect, updateProfile);
router.post('/upload-profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.post('/like', protect, likeUser);
router.get('/matched-users', protect, getMatchedUsers);


module.exports = router;
