# Express.js Backend Server

A production-ready Express.js backend server with security, logging, error handling, and scalability features.

## Features

-   ✅ Express.js with proper folder structure
-   ✅ Security enhancements (Helmet, CORS)
-   ✅ Centralized error handling
-   ✅ Structured logging with Winston
-   ✅ MongoDB database connection
-   ✅ API versioning
-   ✅ Rate limiting & crash handling
-   ✅ Request validation
-   ✅ Graceful shutdown
-   ✅ Caching

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd express-backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/express-backend
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FILE_PATH=./logs
```

4. Create the logs directory

```bash
mkdir logs
```

## Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

-   `GET /api/v1/health` - Health check endpoint

## Project Structure

```
/src
├── /config            # Database & environment configurations
├── /controllers       # Handles request logic
├── /middlewares       # Global middlewares
├── /models            # Database models
├── /routes            # API route definitions
├── /services          # Business logic services
├── /utils             # Helper functions
├── /validations       # Request validation schemas
/logs                  # Stores log files
```

## Error Handling

The server includes a centralized error handling system that:

-   Logs errors with appropriate context
-   Returns consistent error responses
-   Handles different types of errors (validation, authentication, etc.)

## Logging

Logs are stored in the `/logs` directory:

-   `error.log` - Contains error logs
-   `combined.log` - Contains all logs

## Security Features

-   Helmet for secure HTTP headers
-   CORS configuration
-   Rate limiting
-   Request validation
-   Environment variable management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
