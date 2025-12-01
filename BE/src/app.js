import express from 'express'
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
const app = express();
import router from './routes/routes.js';
import authRouter from './routes/authRoutes.js';
import { fileURLToPath } from 'url';
import globalErrorHandler from './middlewares/globalErrorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Passport session cookies & middlewares
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true,
   cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport (must come after session)
app.use(passport.initialize());
app.use(passport.session());

// Body parsers (must come before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS (must come before routes)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization','Accept'],
  credentials:true
}));

// Static files
app.use(express.static(path.join(__dirname,'public')));

// Routes (must come after all middleware but before error handler)
app.use('/api',router);
app.use('/auth',authRouter);

// Global error handler must be registered LAST, AFTER all routes and middleware
// This ensures it catches errors from all route handlers
app.use(globalErrorHandler);

export default app;

