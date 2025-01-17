const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
// Middleware
app.use(bodyParser.json());

// Default route for testing
app.get('/', (req, res) => {
  res.send('Advanced URL Shortener API is running');
});

const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
  
const authRoutes = require('./routes/auth');
app.use(authRoutes);

const urlRoutes = require('./routes/url');
app.use(urlRoutes);

const setupSwagger = require('./utils/swagger');
setupSwagger(app);


module.exports = app;
