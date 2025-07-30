const axios = require('axios');

const testAuth = async () => {
  try {
    console.log('Testing authentication...');
    
    // Test login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@monvi.com',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Token:', loginResponse.data.token);
    console.log('User:', loginResponse.data.user);
    
    // Test protected endpoint
    const token = loginResponse.data.token;
    const productsResponse = await axios.post('http://localhost:5000/api/products', {
      name: 'Test Product',
      description: 'Test description',
      price: 100,
      category: 'clothing',
      images: ['https://example.com/image.jpg'],
      stock: 10
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Product creation successful!');
    console.log('Product ID:', productsResponse.data.data._id);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testAuth(); 