import axios from 'axios';

// Configuration
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';
const BASE_API_URL = 'https://elevate-backend-s28.onrender.com/api';

// Files that were uploaded to production server (from the upload script output)
const uploadedFiles = [
  {
    id: '68e21004b1527e7a2e4fa7c2',
    title: 'Udit-Narayan-Alka-Yagnik-Best-Hindi-Song',
    newFileUrl: '/uploads/1759653467271-102985540_1743967747415-583304618_Kya-Dil-Ne-Kaha---Udit-Narayan-Alka-Yagnik-Best-Hindi-Song.mp3',
    newThumbnailUrl: '/uploads/1743967754148-465867921_faviconpng.jpg'
  },
  {
    id: '68e21091b1527e7a2e4fa820',
    title: 'Super-Human-Sleep',
    newFileUrl: '/uploads/1759653475110-826324636_1744163408681-706526750_963-and-2hz-Super-Human-Sleep.wav',
    newThumbnailUrl: '/uploads/1743967754148-465867921_faviconpng.jpg'
  },
  {
    id: '68e210c8b1527e7a2e4fa842',
    title: 'Deepmedi',
    newFileUrl: '/uploads/1759653482431-642056432_1744171745218-801987053_deepmedi.wav',
    newThumbnailUrl: '/uploads/1745716639415-502869343_12Hz.png'
  }
];

async function testFileAccessibility() {
  console.log('Testing file accessibility on production server...');
  
  for (const file of uploadedFiles) {
    try {
      const fileUrl = `https://elevate-backend-s28.onrender.com${file.newFileUrl}`;
      console.log(`\n Testing: ${file.title}`);
      console.log(`   URL: ${fileUrl}`);
      
      const response = await axios.head(fileUrl, { timeout: 10000 });
      console.log(`    Status: ${response.status} - File accessible`);
      
    } catch (error) {
      console.log(`    Error: ${error.response?.status || error.message}`);
    }
  }
}

async function updateDatabaseUrls() {
  console.log('\n Updating database URLs to point to uploaded files...');
  
  for (const file of uploadedFiles) {
    try {
      console.log(`\n Updating: ${file.title}`);
      console.log(`ID: ${file.id}`);
      console.log(`New file URL: ${file.newFileUrl}`);
      console.log(`New thumbnail URL: ${file.newThumbnailUrl}`);
      
      const updateData = {
        fileUrl: file.newFileUrl,
        thumbnailUrl: file.newThumbnailUrl
      };
      
      const response = await axios.put(`${BASE_API_URL}/music/${file.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Update successful: ${response.data.message || 'Updated'}`);
      
    } catch (error) {
      console.error(`Error updating ${file.title}:`, error.response?.data || error.message);
    }
    
    // Wait between updates
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function verifyDatabaseUpdate() {
  console.log('\n Verifying database updates...');
  
  try {
    const response = await axios.get(`${BASE_API_URL}/music/admin`, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });
    
    const musicRecords = response.data;
    console.log(` Found ${musicRecords.length} music records`);
    
    musicRecords.forEach(record => {
      console.log(`\n ${record.title}:`);
      console.log(`   File URL: ${record.fileUrl}`);
      console.log(`   Thumbnail URL: ${record.thumbnailUrl}`);
      
      // Check if URLs are now using production paths
      if (record.fileUrl && record.fileUrl.startsWith('/uploads/')) {
        console.log(`    File URL is now relative (production ready)`);
      } else if (record.fileUrl && record.fileUrl.includes('192.168.0.100')) {
        console.log(`    File URL still has local IP`);
      }
      
      if (record.thumbnailUrl && record.thumbnailUrl.startsWith('/uploads/')) {
        console.log(`    Thumbnail URL is now relative (production ready)`);
      } else if (record.thumbnailUrl && record.thumbnailUrl.includes('192.168.0.100')) {
        console.log(`    Thumbnail URL still has local IP`);
      }
    });
    
  } catch (error) {
    console.error(' Error verifying database:', error.response?.data || error.message);
  }
}

async function main() {
  try {
    // Test file accessibility
    await testFileAccessibility();
    
    // Update database URLs
    await updateDatabaseUrls();
    
    // Verify the updates
    await verifyDatabaseUpdate();
    
    console.log('\n Database update process completed!');
    console.log('Now restart your Flutter app to test music playback');
    
  } catch (error) {
    console.error(' Error in main process:', error);
  }
}

// Run the update process
main();
