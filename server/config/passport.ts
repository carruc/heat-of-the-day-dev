import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
//import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
//import { Strategy as AppleStrategy } from 'passport-apple';
import User from '../models/User.ts';

interface User {
  _id: string;
  email: string;
  name: string;
  provider: string;
  providerId: string;
}

export const configurePassport = () => {
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Google Strategy Configuration
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id });
      
      if (!user) {
        user = await User.create({
          email: profile.emails![0].value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
          provider: 'google',
          providerId: profile.id,
          accessToken,
          refreshToken
        });
      } else {
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.picture = profile.photos?.[0]?.value;
        await user.save();
      }
      
      return done(null, user);
    } catch (err) {
      return done(err as Error, undefined);
    }
  }));

  // Add Microsoft and Apple strategies similarly 
}; 