const URL = require('../models/url');
const shortid = require('shortid');
const user = require('../models/user');
const mongoose = require('mongoose');

const createShortUrl = async (req, res) => {
    try {
      const { longUrl, customAlias, topic } = req.body;
  
      // Check if custom alias is already in use
      if (customAlias) {
        const existingUrl = await URL.findOne({ customAlias });
        if (existingUrl) {
          return res.status(400).json({ message: 'Custom alias is already in use' });
        }
      }
  
      // Generate short URL
      const shortUrl = customAlias || shortid.generate();
      const newUrl = new URL({
        longUrl,
        shortUrl, 
        customAlias,
        topic,
        createdBy: new mongoose.Types.ObjectId(req.user.id), 
      });
  
      await newUrl.save();
      res.status(201).json({
        message: 'Short URL created successfully',
        shortUrl: `${process.env.BASE_URL}/${shortUrl.replace(/^http:\/\/localhost:3000\/+/g, '')}`, 
        createdAt: newUrl.createdAt,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error creating short URL', error: err.message });
    }
  };
//const URL = require('../models/url');

  const redirectShortUrl = async (req, res) => {
    try {
      const { alias } = req.params;
      // Find the URL by shortUrl or customAlias
      const url = await URL.findOne({
        $or: [{ shortUrl: alias }, { customAlias: alias }],
      });
  
      if (!url) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  
      // Log analytics data
      const userAgent = req.headers['user-agent'];
      const ip = req.ip;
      const os = extractOS(userAgent); 
      const device = extractDevice(userAgent); 
      url.analytics.push({
        userAgent,
        ip,
        os,
        device,
      });
      await url.save();
      // Redirect to the original URL
      res.redirect(url.longUrl);
    } catch (err) {
      res.status(500).json({ message: 'Error handling redirect', error: err.message });
    }
  };
  
  
  const extractOS = (userAgent) => {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/macintosh/i.test(userAgent)) return 'macOS';
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad/i.test(userAgent)) return 'iOS';
    return 'Unknown';
  };
  
  const extractDevice = (userAgent) => {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  };
  
  const getUrlAnalytics = async (req, res) => {
    try {
      const { alias } = req.params;
  
      // Find the URL by alias
      const url = await URL.findOne({
        $or: [{ shortUrl: alias }, { customAlias: alias }],
      });
  
      if (!url) {
        return res.status(404).json({ message: 'Short URL not found' });
      }
  
      // Calculate analytics
      const totalClicks = url.analytics.length;
      const uniqueUsers = new Set(url.analytics.map((entry) => entry.ip)).size;
  
      // Group clicks by date
      const clicksByDate = url.analytics.reduce((acc, entry) => {
        const date = entry.timestamp.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      // Group clicks by OS
      const osType = url.analytics.reduce((acc, entry) => {
        const os = entry.os || 'Unknown';
        if (!acc[os]) {
          acc[os] = { osName: os, uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[os].uniqueClicks += 1;
        acc[os].uniqueUsers.add(entry.ip);
        return acc;
      }, {});
  
      // Convert OS data to an array
      const osAnalytics = Object.values(osType).map((os) => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers.size,
      }));
  
      // Group clicks by device type
      const deviceType = url.analytics.reduce((acc, entry) => {
        const device = entry.device || 'Unknown';
        if (!acc[device]) {
          acc[device] = { deviceName: device, uniqueClicks: 0, uniqueUsers: new Set() };
        }
        acc[device].uniqueClicks += 1;
        acc[device].uniqueUsers.add(entry.ip);
        return acc;
      }, {});
  
      // Convert device data to an array
      const deviceAnalytics = Object.values(deviceType).map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers.size,
      }));
  
      res.json({
        totalClicks,
        uniqueUsers,
        clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({
          date,
          count,
        })),
        osType: osAnalytics,
        deviceType: deviceAnalytics,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching analytics', error: err.message });
    }
  };
  const getTopicAnalytics = async (req, res) => {
    try {
      const { topic } = req.params;
  
      // Fetch all URLs under the specified topic created by the user
      const urls = await URL.find({ topic, createdBy: req.user.id });
  
      if (!urls.length) {
        return res.status(404).json({ message: 'No URLs found under this topic' });
      }
  
      let totalClicks = 0;
      let uniqueUsers = new Set();
      const clicksByDate = {};
      const urlAnalytics = [];
  
      // Aggregate analytics for each URL under the topic
      urls.forEach((url) => {
        const urlTotalClicks = url.analytics.length;
        const urlUniqueUsers = new Set(url.analytics.map((entry) => entry.ip));
  
        totalClicks += urlTotalClicks;
        uniqueUsers = new Set([...uniqueUsers, ...urlUniqueUsers]);
  
        url.analytics.forEach((entry) => {
          const date = entry.timestamp.toISOString().split('T')[0];
          clicksByDate[date] = (clicksByDate[date] || 0) + 1;
        });
  
        urlAnalytics.push({
          shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
          totalClicks: urlTotalClicks,
          uniqueUsers: urlUniqueUsers.size,
        });
      });
  
      res.json({
        totalClicks,
        uniqueUsers: uniqueUsers.size,
        clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({
          date,
          count,
        })),
        urls: urlAnalytics,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching topic analytics', error: err.message });
    }
  };


  const getOverallAnalytics = async (req, res) => {
    try {
      console.log('Authenticated User ID:', req.user.id);
      // Fetch all URLs created by the authenticated user
      const urls = await URL.find({ createdBy: req.user.id });
  
      if (!urls.length) {
        return res.status(404).json({ message: 'No URLs found for this user' });
      }
  
      let totalClicks = 0;
      let uniqueUsers = new Set();
      const clicksByDate = {};
      const osType = {};
      const deviceType = {};
  
      // Aggregate analytics across all URLs
      urls.forEach((url) => {
        totalClicks += url.analytics.length;
        url.analytics.forEach((entry) => {
          uniqueUsers.add(entry.ip);
  
          // Clicks by date
          const date = entry.timestamp.toISOString().split('T')[0];
          clicksByDate[date] = (clicksByDate[date] || 0) + 1;
  
          // Clicks by OS
          const os = entry.os || 'Unknown';
          if (!osType[os]) osType[os] = { osName: os, uniqueClicks: 0, uniqueUsers: new Set() };
          osType[os].uniqueClicks += 1;
          osType[os].uniqueUsers.add(entry.ip);
  
          // Clicks by device
          const device = entry.device || 'Unknown';
          if (!deviceType[device]) deviceType[device] = { deviceName: device, uniqueClicks: 0, uniqueUsers: new Set() };
          deviceType[device].uniqueClicks += 1;
          deviceType[device].uniqueUsers.add(entry.ip);
        });
      });
  
      res.json({
        totalUrls: urls.length,
        totalClicks,
        uniqueUsers: uniqueUsers.size,
        clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({
          date,
          count,
        })),
        osType: Object.values(osType).map((os) => ({
          osName: os.osName,
          uniqueClicks: os.uniqueClicks,
          uniqueUsers: os.uniqueUsers.size,
        })),
        deviceType: Object.values(deviceType).map((device) => ({
          deviceName: device.deviceName,
          uniqueClicks: device.uniqueClicks,
          uniqueUsers: device.uniqueUsers.size,
        })),
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching overall analytics', error: err.message });
    }
  };
  
  module.exports = {
    createShortUrl,
    redirectShortUrl,
    getUrlAnalytics,
    getTopicAnalytics,
    getOverallAnalytics,
  };
  