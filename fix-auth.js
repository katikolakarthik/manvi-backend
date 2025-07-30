const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const connectDB = require('./config/database');

const fixAuth = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Delete existing admin user
    await User.deleteOne({ email: 'admin@monvi.com' });
    console.log('Deleted existing admin user');
    
    // Create new admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@monvi.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@monvi.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('🆔 User ID:', adminUser._id);
    
    // Test JWT token generation
    const token = adminUser.getSignedJwtToken();
    console.log('🔐 JWT Token generated:', token ? 'SUCCESS' : 'FAILED');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing auth:', error.message);
    process.exit(1);
  }
};

fixAuth(); 