import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    // Connection options for MongoDB
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip IPv6
    };

    await mongoose.connect(process.env.MONGO_URI, options);

    mongoose.connection.on('connected', () => {
      console.log('✅ تم الاتصال بنجاح بقاعدة البيانات');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ خطأ في اتصال قاعدة البيانات:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  تم قطع الاتصال بقاعدة البيانات');
    });

    // Close connection on process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('✋ تم إغلاق اتصال قاعدة البيانات بسبب إنهاء التطبيق');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ فشل الاتصال الأولي بقاعدة البيانات:', err.message);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;