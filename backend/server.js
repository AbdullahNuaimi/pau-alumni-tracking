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
import metricsRoutes from './routes/metricsRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config({ path: './config/config.env' });


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://frontend-delta-wine.vercel.app/' 
    : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json(({ limit: '50mb' })));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));


// Welcome message route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PAU Alumni Tracking System API',
    status: 'Server is running',
    version: '1.0.0',
    documentation: 'API endpoints are available at /api/v1/'
  });
});

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/posts', commentRoutes);
app.use('/api/v1/users', userRoutes);  
app.use('/api/v1/articles', articleRoutes); 
app.use('/api/v1/messages', messageRoutes); 
app.use('/api/v1/notifications', notificationRoutes);


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
    🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
    📅 ${new Date().toLocaleString()}
    `);
  });
});