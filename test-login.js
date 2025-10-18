import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    console.log('Testing login with admin user...');
    
    const response = await fetch('https://elevate-backend-s28.onrender.com/api/users/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admininselevateintune@example.com',
        password: 'admin123' // You'll need to provide the correct password
      })
    });
    
    const data = await response.json();
    console.log('Login response status:', response.status);
    console.log('Login response:', data);
    
    if (response.ok && data.token) {
      console.log('Login successful! Token received.');
      
      // Test music upload endpoint
      console.log('\n Testing music upload endpoint...');
      const uploadResponse = await fetch('https://elevate-backend-s28.onrender.com/api/music/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Song',
          artist: 'Test Artist',
          category: '507f1f77bcf86cd799439011', // You'll need a valid category ID
          categoryType: '507f1f77bcf86cd799439012', // You'll need a valid categoryType ID
          duration: 180,
          releaseDate: '2025-01-01'
        })
      });
      
      const uploadData = await uploadResponse.json();
      console.log('Upload response status:', uploadResponse.status);
      console.log('Upload response:', uploadData);
    } else {
      console.log(' Login failed');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
};

testLogin();
