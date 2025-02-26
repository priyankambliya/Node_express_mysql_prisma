# Node.js Express API with MySQL & Prisma ORM

A powerful and efficient RESTful API built with Node.js and Express framework, utilizing MySQL as the database and Prisma ORM for seamless database management.

## Features

- **Prisma ORM**: Type-safe and flexible database queries
- **Express Framework**: Fast and lightweight routing
- **MySQL Integration**: Efficient and reliable data storage
- **RESTful API Design**: Organized and maintainable endpoints
- **Security**: Implemented with best practices for security and error handling

## Tech Stack

- Node.js - Backend runtime environment
- Express - Web framework for routing and middleware
- MySQL - Relational database for structured data
- Prisma ORM - Elegant and type-safe database access

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start the server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=app_port
DATABASE_URL=mysql://db_user:db_password@localhost:3306/db_name

JWT_ACCESS_SECRET=jwt_access_secret
JWT_ACCESS_EXPIRES_IN=2h
JWT_REFRESH_SECRET=jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

REDIS_HOST=127.0.0.1 // local default host
REDIS_PORT=6379 // local default port
```

## Project Structure

```
prisma/              # Prisma schema and models
src/
├── controllers/    # Request handlers
├── database/       # Handle database
├── middlewares/    # Custom middleware
├── providers/      # Providers handler
├── routes/         # API routes
├── types/          # Change Type logic
├── utils/          # Helper functions
├── validation/     # validation provider
├── server.ts       # Application entry point and server logic
└── app.ts          # Application Logic
```
