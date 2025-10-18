import axios from 'axios';
import FormData from 'form-data';

// Configuration
const PRODUCTION_API_URL = 'https://elevate-backend-s28.onrender.com/api/music/upload';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';

// List of missing files to upload
const missingFiles = [
  {
    name: 'Kya-Dil-Ne-Kaha---Udit-Narayan-Alka-Yagnik-Best-Hindi-Song.mp3',
    localPath: 'http://192.168.0.100:5000/uploads/1759645696973-485761936_1743967747415-583304618_Kya-Dil-Ne-Kaha---Udit-Narayan-Alka-Yagnik-Best-Hindi-Song.mp3',
    type: 'audio'
  },
  {
    name: 'images.png',
    localPath: 'http://192.168.0.100:5000/uploads/1759645700340-903577069_1745691977346-329608825_images.png',
    type: 'image'
  },
  {
    name: '963-and-2hz-Super-Human-Sleep.wav',
    localPath: 'http://192.168.0.100:5000/uploads/1759645837708-937678283_1744163408681-706526750_963-and-2hz-Super-Human-Sleep.wav',
    type: 'audio'
  },
  {
    name: 'faviconpng.jpg',
    localPath: 'http://192.168.0.100:5000/uploads/1759645841110-919698469_1743967754148-465867921_faviconpng.jpg',
    type: 'image'
  },
  {
    name: 'deepmedi.wav',
    localPath: 'http://192.168.0.100:5000/uploads/1759645895818-863657805_1744171745218-801987053_deepmedi.wav',
    type: 'audio'
  },
  {
    name: '12Hz.png',
    localPath: 'http://192.168.0.100:5000/uploads/1759645896970-329109118_1745716639415-502869343_12Hz.png',
    type: 'image'
  }
];

async function downloadAndUploadFile(fileInfo) {
  try {
    console.log(`\n Processing: ${fileInfo.name}`);
    console.log(`   Local URL: ${fileInfo.localPath}`);
    
    // Download file from local server
    console.log('Downloading file...');
    const response = await axios.get(fileInfo.localPath, {
      responseType: 'stream',
      timeout: 30000
    });
    
    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', response.data, {
      filename: fileInfo.name,
      contentType: fileInfo.type === 'audio' ? 'audio/mpeg' : 'image/png'
    });
    
    // Upload to production server
    console.log('    Uploading to production server...');
    const uploadResponse = await axios.post(PRODUCTION_API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        ...formData.getHeaders()
      },
      timeout: 60000
    });
    
    console.log('Upload successful!');
    console.log('Response:', uploadResponse.data);
    
    return {
      success: true,
      file: fileInfo.name,
      response: uploadResponse.data
    };
    
  } catch (error) {
    console.error(`Error processing ${fileInfo.name}:`, error.response?.data || error.message);
    return {
      success: false,
      file: fileInfo.name,
      error: error.message
    };
  }
}

async function uploadMissingFiles() {
  console.log('Starting upload of missing files to production server...');
  console.log(` Total files to upload: ${missingFiles.length}`);
  
  const results = [];
  
  for (const fileInfo of missingFiles) {
    const result = await downloadAndUploadFile(fileInfo);
    results.push(result);
    
    // Wait a bit between uploads to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n Upload Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(` Successful uploads: ${successful}`);
  console.log(` Failed uploads: ${failed}`);
  
  if (failed > 0) {
    console.log('\n Failed files:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.file}: ${r.error}`);
    });
  }
  
  console.log('\n Upload process completed!');
  console.log('Now restart your Flutter app to test music playback');
}

// Run the upload process
uploadMissingFiles().catch(console.error);
