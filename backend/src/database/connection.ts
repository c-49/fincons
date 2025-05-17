import mongoose from 'mongoose';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  static getInstance(): DatabaseConnection {
    return this.instance ??= new DatabaseConnection();
  }

  async connect(uri: string = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/trivia'): Promise<void> {
    if (this.isConnected) return;

    try {
      await mongoose.connect(uri);
      this.isConnected = true;
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    await mongoose.disconnect();
    this.isConnected = false;
    console.log('📝 Disconnected from MongoDB');
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}