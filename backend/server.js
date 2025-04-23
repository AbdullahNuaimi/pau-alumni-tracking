import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url'


// Routes
import { authRoutes } from './routes/authRoutes.js';
import { postRoutes } from './routes/postRoutes.js';
import { commentRoutes } from './routes/commentRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { articleRoutes } from './routes/articleRoutes.js';

dotenv.config({ path: './config/config.env' });


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true,
}));
app.use(express.json(({ limit: '50mb' })));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Arabic content-type support
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
// app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/posts', commentRoutes);
app.use('/api/v1/users', userRoutes);  
app.use('/api/v1/articles', articleRoutes); 

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