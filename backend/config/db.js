import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Connection options for MongoDB
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10s
      socketTimeoutMS: 45000,
      family: 4,
    };

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ Successfully connected to MongoDB');

    mongoose.connection.on('connected', () => {
      console.log('✅ Database connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Database connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Database connection disconnected');
    });

    // Close connection on process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('✋ Database connection closed due to app termination');
      process.exit(0);
    });

    return true;
  } catch (err) {
    console.error('❌ Initial database connection failed:', err.message);
    return false;
  }
};

export default connectDB;