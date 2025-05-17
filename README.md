# Trivia Quiz Application

A fullstack trivia application built with React, Redux, Node.js, Express, and MongoDB.

## Features

- Select a trivia category and difficulty level
- Answer randomized multiple-choice questions
- View quiz results with correct answers highlighted
- Score summary with color-coded performance indicator
- Mobile-responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Redux with Redux Toolkit for state management
- CSS for styling

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose

### DevOps
- Docker & Docker Compose
- Nginx for production deployment

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- MongoDB (or Docker for containerized setup)
- Docker and Docker Compose (for containerized setup)

### Running with Docker (Recommended)

1. Start the application with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. Access the application at http://localhost

### Running Locally

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start MongoDB:
   ```bash
   # Run MongoDB locally or use a cloud instance
   ```

3. Seed the database:
   ```bash
   cd backend
   npm run seed
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```

5. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

6. Access the application at http://localhost:3000

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.