const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
