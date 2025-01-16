const express = require('express');
const passport = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  }
);

module.exports = router;
