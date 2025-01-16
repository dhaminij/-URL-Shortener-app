const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customAlias: { type: String, unique: true },
  topic: { type: String },
  analytics: [
    {
      timestamp: { type: Date, default: Date.now },
      userAgent: String,
      ip: String,
      os: String,
      device: String,
      geolocation: Object,
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('URL', urlSchema);
