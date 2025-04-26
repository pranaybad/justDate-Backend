const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes')

require("dotenv").config();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));




app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



app.get("/", (req, res) => {
  res.send("Api running");
});

module.exports = app;
