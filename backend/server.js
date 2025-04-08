import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// import errorHandler from './middlewares/errorHandler.js';

// Routes
// import authRoutes from './routes/authRoutes.js';
// import postRoutes from './routes/postRoutes.js';

dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Arabic content-type support
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/posts', postRoutes);

// Error handling
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
    🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
    📅 ${new Date().toLocaleString()}
    `);
  });
});