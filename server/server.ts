import * as dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { configurePassport } from "./config/passport.ts";
import authRoutes from "./routes/auth.ts";
import records from "./routes/record.ts";
import { connectToDatabase } from "./db/connection.ts";

const PORT = process.env.PORT || 5050;
const app = express();

// Initialize database connection
connectToDatabase()
  .then(() => {
    app.use(cors({
      origin: "http://localhost:5173", // Your Vite dev server
      credentials: true
    }));

    app.use(express.json());
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false
    }));

    // Initialize Passport and restore authentication state from session
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure Passport strategies
    configurePassport();

    // Routes
    app.use("/auth", authRoutes);
    app.use("/record", records);

    // start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });
