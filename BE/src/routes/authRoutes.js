import express from 'express';
import passport from '../config/passport.js';
import {login,logout,signup,resetPassword} from '../controllers/authControllers.js';

const authRouter = express.Router();

//Farmer & buyer login
authRouter.post('/login/farmer', passport.authenticate('local-farmer'), login);
authRouter.post('/login/buyer', passport.authenticate('local-buyer'), login);

//Signup and reset (already use Farmer table by default)
authRouter.post('/signup', signup);
authRouter.post('/reset-password', resetPassword);
authRouter.get('/logout', logout);

/*
// Facebook login — dynamically set userType as state
authRouter.get('/facebook', (req, res, next) => {
  const userType = req.query.userType || 'farmer'; // default to farmer
  passport.authenticate('facebook', {
    scope: ['email'],
    session: true,
    state: userType, // pass userType as state
  })(req, res, next);
});

// Facebook callback — extract userType from state
authRouter.get('/facebook/callback',(req, res, next) => {
    passport.authenticate('facebook', {
      failureRedirect: '/login',
      session: true,
      state: req.query.state, // read userType from state
    })(req, res, next);
  },
  (req, res) => {
    res.redirect('/dashboard'); // or return JSON
  }
);

// Google login — pass userType via `state`
authRouter.get('/google', (req, res, next) => {
  const userType = req.query.userType || 'farmer'; // default to farmer
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: true,
    state: userType, // pass as state
  })(req, res, next);
});

// Google callback — state contains userType
authRouter.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: '/login',
      session: true,
      state: req.query.state, // read userType from state
    })(req, res, next);
  },
  (req, res) => {
    res.redirect('/dashboard'); // or handle redirect based on userType
  }
);
*/

export default authRouter;
