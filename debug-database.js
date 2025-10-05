import axios from 'axios';

// Configuration
const API_URL = 'https://elevate-backend-s28.onrender.com/api/music/admin';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database state...');
    
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Raw API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check each record individually
    response.data.forEach((music, index) => {
      console.log(`\n🎵 Record ${index + 1}: ${music.title}`);
      console.log(`   ID: ${music._id}`);
      console.log(`   File URL: ${music.fileUrl}`);
      console.log(`   Thumbnail URL: ${music.thumbnailUrl}`);
      console.log(`   Contains 192.168.0.100: ${music.fileUrl?.includes('192.168.0.100') || music.thumbnailUrl?.includes('192.168.0.100')}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugDatabase();
