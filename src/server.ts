import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
// import cookieParser from 'cookie-parser';
import passport from './config/passport';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import v1Routes from './routes/v1';
import logger from './config/logger';
import { httpLogger } from './middleware/logging.middleware';
import { startCleanupScheduler } from './utils/scheduler';
import notificationRoutes from './modules/notification/infra/notification.routes';

import session from 'express-session';


// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT ;

// Connect to MongoDB
connectDB().then(() => {
  logger.info('Database connected successfully');
  
  // Start the S3 cleanup scheduler after database is connected
  startCleanupScheduler();
  logger.info('S3 cleanup scheduler started');
}).catch((err) => {
  logger.error('Database connection error:', err);
  process.exit(1);
});

// Middleware
app.use(httpLogger); // Add HTTP request logging
app.use(cors({
  origin: process.env.FRONTEND_URL ,
  credentials: true
}));
// app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // Add passport session support

// API Routes
app.use('/api/v1', v1Routes);
app.use('/api/notifications', notificationRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Express + TypeScript Server' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
}); 