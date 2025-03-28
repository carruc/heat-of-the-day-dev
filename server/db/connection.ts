import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const uri = process.env.ATLAS_URI;

if (!uri) {
  throw new Error('ATLAS_URI environment variable is not defined');
}

async function connectToDatabase() {
  try {
    await mongoose.connect(uri as string);
    console.log("Successfully connected to MongoDB!");
  } catch(err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

export { connectToDatabase };
