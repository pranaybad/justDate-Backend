const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes')

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));




app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);




app.get("/", (req, res) => {
  res.send("Api running");
});

module.exports = app;
