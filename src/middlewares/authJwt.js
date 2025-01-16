const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  console.log('Authenticating JWT for route:', req.originalUrl);
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Decoded Token:', decoded);
    console.log('Request User:', req.user); 
    next();
  } catch (err) {
    console.error('JWT Verification Failed:', err.message); // Log verification errors
    res.status(403).json({ message: 'Token verification failed' });
  }
};

module.exports = authenticateJWT;

// hi