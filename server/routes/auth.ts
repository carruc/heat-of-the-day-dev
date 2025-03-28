import express from 'express';
import type { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.redirect('/login?error=server_configuration');
    }

    if (!req.user) {
      console.error('User not found in request');
      return res.redirect('/login?error=user_not_found');
    }

    try {
      const token = jwt.sign(
        { 
          user: {
            id: (req.user as any)._id,
            email: (req.user as any).email,
            name: (req.user as any).name,
            picture: (req.user as any).picture
          }
        }, 
        process.env.JWT_SECRET,
        { 
          expiresIn: '24h',
          algorithm: 'HS256'
        }
      );
      
      // Redirect to frontend with token
      res.redirect(`http://localhost:5173/auth-success?token=${token}`);
    } catch (error) {
      console.error('Error generating token:', error);
      res.redirect('/login?error=token_generation');
    }
  }
);

// Add similar routes for Microsoft and Apple

export default router; 