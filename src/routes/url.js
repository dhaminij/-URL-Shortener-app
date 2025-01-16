const express = require('express');
const { createShortUrl } = require('../controllers/urlController');
const { redirectShortUrl } = require('../controllers/urlController');
const { getUrlAnalytics } = require('../controllers/urlController');
const { getTopicAnalytics } = require('../controllers/urlController');
const { getOverallAnalytics } = require('../controllers/urlController');
const authenticateJWT = require('../middlewares/authJwt');

const router = express.Router();

// Shorten URL route
router.post('/api/shorten', authenticateJWT, createShortUrl);
router.get('/api/shorten/:alias', redirectShortUrl);
router.get('/api/analytics/:alias', authenticateJWT, getUrlAnalytics);
router.get('/api/analytics/topic/:topic', authenticateJWT, getTopicAnalytics);
router.get('/overall/analytics', authenticateJWT, getOverallAnalytics);

module.exports = router;
