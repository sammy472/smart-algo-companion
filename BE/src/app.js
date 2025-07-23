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

app.use('/api',router);
app.use('/auth',authRouter);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization','Accept'],
  credentials:true
}));
app.use(express.static(path.join(__dirname,'public')));

// Optional: Global error handler
app.use(globalErrorHandler);

export default app;

