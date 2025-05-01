const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization  &&
    req.headers.authorization .startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
      
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "No token, authorization  denied" });
  }
};


exports.authMiddleware = async(req, res, next) => {
  
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded.id;
    req.user = await User.findById(decoded.id).select("-password");
    next();  
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
