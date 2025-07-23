import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db from '../database/client.js';
import { farmers, buyers } from '../database/schema.js';
import dotenv from 'dotenv';
dotenv.config();

// Helper: Authenticate a user by email and password from a table
const authenticateUser = async (email, password, table) => {
  const users = await db.select().from(table).where(eq(table.email, email));
  const user = users[0];
  if (!user) return null;
  const passwordMatch = await bcrypt.compare(password, user.password);
  return passwordMatch ? user : null;
};

//Local strategy for Farmers
passport.use('local-farmer', new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await authenticateUser(email, password, farmers);
      if (!user) return done(null, false, { message: 'Invalid farmer credentials' });
      user.role = 'farmer';
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

//Local strategy for Buyers
passport.use('local-buyer', new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await authenticateUser(email, password, buyers);
      if (!user) return done(null, false, { message: 'Invalid buyer credentials' });
      user.role = 'buyer';
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

//Session support
passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async (sessionUser, done) => {
  try {
    const table = sessionUser.role === 'buyer' ? buyers : farmers;
    const users = await db.select().from(table).where(eq(table.id, sessionUser.id));
    done(null, users[0]);
  } catch (err) {
    done(err);
  }
});

/*
//Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'photos'],
      passReqToCallback: true, // Pass request object to callback for userType detection
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('Email not provided by Facebook'), null);

        // Determine userType from query string or session (default to farmer)
        const userType = req.query.userType === 'buyer' ? 'buyer' : 'farmer';
        let user;

        if (userType === 'farmer') {
          const existingFarmer = await db
            .select()
            .from(farmers)
            .where(eq(farmers.email, email));

          if (existingFarmer.length > 0) {
            user = existingFarmer[0];
          } else {
            const result = await db
              .insert(farmers)
              .values({
                name: profile.displayName,
                email,
                avatar: profile.photos?.[0]?.value || null,
                date_created: new Date(),
              })
              .returning();

            user = result[0];
          }
        } else {
          const existingBuyer = await db
            .select()
            .from(buyers)
            .where(eq(buyers.email, email));

          if (existingBuyer.length > 0) {
            user = existingBuyer[0];
          } else {
            const result = await db
              .insert(buyers)
              .values({
                name: profile.displayName,
                email,
                avatar: profile.photos?.[0]?.value || null,
                date_created: new Date(),
              })
              .returning();

            user = result[0];
          }
        }

        return done(null, user);
      } catch (err) {
        console.error('Facebook OAuth error:', err);
        return done(err, null);
      }
    }
  )
);

//Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('Email not provided by Google'), null);

        const userType = req.query.userType === 'buyer' ? 'buyer' : 'farmer';
        let user;

        if (userType === 'farmer') {
          const existingFarmer = await db
            .select()
            .from(farmers)
            .where(eq(farmers.email, email));

          if (existingFarmer.length > 0) {
            user = existingFarmer[0];
          } else {
            const result = await db
              .insert(farmers)
              .values({
                name: profile.displayName,
                email,
                avatar: profile.photos?.[0]?.value || null,
                date_created: new Date(),
              })
              .returning();

            user = result[0];
          }
        } else {
          const existingBuyer = await db
            .select()
            .from(buyers)
            .where(eq(buyers.email, email));

          if (existingBuyer.length > 0) {
            user = existingBuyer[0];
          } else {
            const result = await db
              .insert(buyers)
              .values({
                name: profile.displayName,
                email,
                avatar: profile.photos?.[0]?.value || null,
                date_created: new Date(),
              })
              .returning();

            user = result[0];
          }
        }

        return done(null, user);
      } catch (err) {
        console.error('Google OAuth error:', err);
        return done(err, null);
      }
    }
  )
);*/
export default passport;
