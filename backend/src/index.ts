import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseConnection } from './database/connection';
import { categoryRoutes } from './routes/categoryRoutes';
import { quizRoutes } from './routes/quizRoutes';

// Load environment variables
dotenv.config();

class Server {
  private app = express();
  private port = process.env.PORT ?? 3001;
  private db = DatabaseConnection.getInstance();

  constructor() {
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`, req.query);
      next();
    });
  }

  private setupRoutes(): void {
    this.app.use('/api/categories', categoryRoutes);
    this.app.use('/api/quiz', quizRoutes);
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: this.db.getConnectionStatus()
      });
    });
  }

  async start(): Promise<void> {
    try {
      await this.db.connect();
      
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server
new Server().start();