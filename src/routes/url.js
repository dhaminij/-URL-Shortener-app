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

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original long URL
 *               customAlias:
 *                 type: string
 *                 description: A custom alias for the short URL
 *               topic:
 *                 type: string
 *                 description: A topic for categorization
 *     responses:
 *       201:
 *         description: Short URL created successfully
 */

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL alias
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific short URL
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL alias
 *     responses:
 *       200:
 *         description: Returns analytics for the specified short URL
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for URLs under a specific topic
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic name
 *     responses:
 *       200:
 *         description: Returns analytics for the specified topic
 *       404:
 *         description: No URLs found under this topic
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics for all short URLs
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Returns overall analytics
 *       404:
 *         description: No URLs found for this user
 *       500:
 *         description: Internal server error
 */

module.exports = router;
