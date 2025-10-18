import axios from 'axios';

// Configuration
const API_URL = 'https://elevate-backend-s28.onrender.com/api/music';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';

async function updateRecordsDirectly() {
  try {
    console.log(' Getting all music records...');
    
    // Get all records
    const response = await axios.get(`${API_URL}/admin`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Found ${response.data.length} music records`);
    
    let updatedCount = 0;
    
    // Update each record individually
    for (const music of response.data) {
      console.log(`\n Processing: ${music.title}`);
      
      let needsUpdate = false;
      const updateData = {};
      
      // Check and update fileUrl
      if (music.fileUrl && music.fileUrl.includes('192.168.0.100')) {
        const newFileUrl = music.fileUrl.replace(
          'http://192.168.0.100:5000',
          'https://elevate-backend-s28.onrender.com'
        );
        updateData.fileUrl = newFileUrl;
        needsUpdate = true;
        console.log(`New fileUrl: ${newFileUrl}`);
      }
      
      // Check and update thumbnailUrl
      if (music.thumbnailUrl && music.thumbnailUrl.includes('192.168.0.100')) {
        const newThumbnailUrl = music.thumbnailUrl.replace(
          'http://192.168.0.100:5000',
          'https://elevate-backend-s28.onrender.com'
        );
        updateData.thumbnailUrl = newThumbnailUrl;
        needsUpdate = true;
        console.log(`New thumbnailUrl: ${newThumbnailUrl}`);
      }
      
      // Update the record if needed
      if (needsUpdate) {
        try {
          await axios.put(`${API_URL}/${music._id}`, updateData, {
            headers: {
              'Authorization': `Bearer ${ADMIN_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });
          updatedCount++;
          console.log(`Updated record: ${music.title}`);
        } catch (updateError) {
          console.error(`Failed to update ${music.title}:`, updateError.response?.data || updateError.message);
        }
      } else {
        console.log(`No changes needed for: ${music.title}`);
      }
    }
    
    console.log(`\n Update Summary:`);
    console.log(`Successfully updated: ${updatedCount} records`);
    console.log(`No changes needed: ${response.data.length - updatedCount} records`);
    
    if (updatedCount > 0) {
      console.log('\n Database URLs updated successfully!');
      console.log('Now restart your Flutter app to test music playback');
    }

  } catch (error) {
    console.error('Error updating records:', error.response?.data || error.message);
  }
}

// Run the update
updateRecordsDirectly();
