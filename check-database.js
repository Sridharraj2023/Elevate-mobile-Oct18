import axios from 'axios';

// Configuration
const API_URL = 'https://elevate-backend-s28.onrender.com/api/music/admin';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';

async function checkDatabaseUrls() {
  try {
    console.log('🔍 Checking current database URLs...');
    console.log(`📡 API URL: ${API_URL}`);
    
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Database check successful!');
    console.log(`📊 Found ${response.data.length} music records`);
    
    // Check each record for local URLs
    let localUrlCount = 0;
    response.data.forEach((music, index) => {
      console.log(`\n🎵 Record ${index + 1}: ${music.title}`);
      console.log(`   File URL: ${music.fileUrl}`);
      console.log(`   Thumbnail URL: ${music.thumbnailUrl}`);
      
      if (music.fileUrl && music.fileUrl.includes('192.168.0.100')) {
        console.log('   ⚠️  File URL contains local IP!');
        localUrlCount++;
      }
      if (music.thumbnailUrl && music.thumbnailUrl.includes('192.168.0.100')) {
        console.log('   ⚠️  Thumbnail URL contains local IP!');
        localUrlCount++;
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total records: ${response.data.length}`);
    console.log(`   Records with local URLs: ${localUrlCount}`);
    
    if (localUrlCount > 0) {
      console.log('   🔧 Database still has local URLs - need to update!');
    } else {
      console.log('   ✅ All URLs are production URLs!');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.response?.data || error.message);
  }
}

// Run the check
checkDatabaseUrls();
