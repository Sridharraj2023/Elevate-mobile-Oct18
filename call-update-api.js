import axios from 'axios';

// Configuration
const API_URL = 'https://elevate-backend-s28.onrender.com/api/music/update-urls';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';

async function updateDatabaseUrls() {
  try {
    console.log('🔄 Calling database URL update API...');
    console.log(`📡 API URL: ${API_URL}`);
    
    if (ADMIN_TOKEN === 'PASTE_YOUR_ADMIN_TOKEN_HERE') {
      console.error('❌ Please set your ADMIN_TOKEN in the script');
      console.log('💡 Get your admin token from the admin panel login');
      return;
    }

    const response = await axios.post(API_URL, {}, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Database URLs updated successfully!');
    console.log('📊 Response:', response.data);
    
    if (response.data.success) {
      console.log(`🎉 Updated ${response.data.updatedCount} records`);
      console.log('🔄 Now restart your Flutter app to test music playback');
    }

  } catch (error) {
    console.error('❌ Error updating database URLs:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Authentication failed. Please check your admin token.');
    } else if (error.response?.status === 403) {
      console.log('💡 Access denied. Make sure you are logged in as admin.');
    }
  }
}

// Run the update
updateDatabaseUrls();
