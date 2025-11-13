const axios = require('axios');

async function seedAdmin() {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/seed-admin', {
      username: 'admin',
      password: 'admin123',
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '0123456789',
      address: 'Admin Address'
    });
    
    console.log('Admin created successfully:', response.data);
  } catch (error) {
    console.error('Error creating admin:', error.response?.data || error.message);
  }
}

seedAdmin();

