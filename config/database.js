const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // Use default MongoDB URI if not provided
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/manvi';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection failed:', error.message);
    logger.info('Please make sure MongoDB is running or set MONGODB_URI in .env file');
    // Don't exit the process, just log the error
    // process.exit(1);
  }
};

module.exports = connectDB; 