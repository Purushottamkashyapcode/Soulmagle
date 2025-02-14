import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import db from './config/db.config.js';  // Sequelize connection

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test Database Connection & Sync Tables
db.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database');

    // Force sync to create the Users table
    db.sync({ force: true })  // This will drop existing tables and recreate them
      .then(() => console.log('Database synced successfully and tables created!'))
      .catch((err) => console.error('Error syncing database:', err));
  })
  .catch((err) => console.error('Database connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;
