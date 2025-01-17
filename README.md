# Advanced URL Shortener API

An advanced URL shortener API with comprehensive analytics, custom aliases, rate limiting, and caching using Redis. The API supports user authentication via Google Sign-In and provides detailed insights into URL performance.

## Features

- **User Authentication**: Secure login via Google Sign-In.
- **Short URL Creation**: Generate short URLs with optional custom aliases.
- **Redirect API**: Redirect short URLs to the original long URLs.
- **Analytics**:
  - Total clicks.
  - Unique users.
  - Clicks grouped by date, OS, and device type.
- **Topic-Based Analytics**: Group and analyze URLs under specific topics.
- **Caching**: Optimized performance with Redis.
- **Rate Limiting**: Prevent abuse with rate limits on API calls.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/dhaminij/-URL-Shortener-app
   cd advanced-url-shortener

2. Install dependencies:
    npm install

3. Configure environment variables: Create a .env file in the root directory and add the following:
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/urlshortener
    REDIS_HOST=localhost
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    BASE_URL=http://localhost:3000

4. Start MongoDB and Redis:
    mongod

5. Start the server:
    npm run dev

6. API Endpoints
1. User Authentication
GET /auth/google: Initiate Google Sign-In.
GET /auth/google/callback: Callback URL for Google Sign-In.
2. Short URL APIs
POST /api/shorten: Create a short URL.

Request Body:
json
Copy
Edit
{
  "longUrl": "https://example.com",
  "customAlias": "custom123",
  "topic": "activation"
}
Response:
json
Copy
Edit
{
  "message": "Short URL created successfully",
  "shortUrl": "http://localhost:3000/custom123",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
GET /api/shorten/{alias}: Redirect to the original URL.

3. Analytics APIs
    GET /api/analytics/{alias}: Get analytics for a specific short URL.

Response:
{
  "totalClicks": 5,
  "uniqueUsers": 3,
  "clicksByDate": [
    { "date": "2025-01-15", "count": 5 }
  ],
  "osType": [
    { "osName": "Windows", "uniqueClicks": 2, "uniqueUsers": 2 },
    { "osName": "Android", "uniqueClicks": 3, "uniqueUsers": 1 }
  ],
  "deviceType": [
    { "deviceName": "Desktop", "uniqueClicks": 2, "uniqueUsers": 2 },
    { "deviceName": "Mobile", "uniqueClicks": 3, "uniqueUsers": 1 }
  ]
}
GET /api/analytics/topic/{topic}: Get analytics for URLs grouped under a specific topic.

GET /api/analytics/overall: Get overall analytics for all short URLs created by the user

7.  Deployment
Docker Deployment
Build and start services using Docker Compose:
docker-compose up --build
Access the API at:
http://localhost:3000

8. Testing
Run Tests
The project includes integration tests written with Jest and Supertest. Run the tests with:
npm test

9. Documentation
Swagger API Docs: Access detailed API documentation at:
http://localhost:3000/api-docs