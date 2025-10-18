import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Configuration
const PRODUCTION_API_URL = 'https://elevate-backend-s28.onrender.com/api/music/upload';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';

// Files that are currently in the database (from the logs)
const databaseFiles = [
  {
    id: '68e21004b1527e7a2e4fa7c2',
    title: 'Udit-Narayan-Alka-Yagnik-Best-Hindi-Song',
    fileUrl: 'http://192.168.0.100:5000/uploads/1759645696973-485761936_1743967747415-583304618_Kya-Dil-Ne-Kaha---Udit-Narayan-Alka-Yagnik-Best-Hindi-Song.mp3',
    thumbnailUrl: 'http://192.168.0.100:5000/uploads/1759645700340-903577069_1745691977346-329608825_images.png'
  },
  {
    id: '68e21091b1527e7a2e4fa820',
    title: 'Super-Human-Sleep',
    fileUrl: 'http://192.168.0.100:5000/uploads/1759645837708-937678283_1744163408681-706526750_963-and-2hz-Super-Human-Sleep.wav',
    thumbnailUrl: 'http://192.168.0.100:5000/uploads/1759645841110-919698469_1743967754148-465867921_faviconpng.jpg'
  },
  {
    id: '68e210c8b1527e7a2e4fa842',
    title: 'Deepmedi',
    fileUrl: 'http://192.168.0.100:5000/uploads/1759645895818-863657805_1744171745218-801987053_deepmedi.wav',
    thumbnailUrl: 'http://192.168.0.100:5000/uploads/1759645896970-329109118_1745716639415-502869343_12Hz.png'
  }
];

function analyzeDuplicates() {
  console.log('Analyzing files in uploads directory...');
  
  const uploadsDir = './uploads';
  const files = fs.readdirSync(uploadsDir);
  
  console.log(`Total files in uploads directory: ${files.length}`);
  
  // Group files by base name (without timestamp prefix)
  const fileGroups = {};
  
  files.forEach(file => {
    // Extract the base name after the timestamp prefix
    const parts = file.split('-');
    if (parts.length >= 3) {
      const baseName = parts.slice(2).join('-'); // Everything after the second dash
      if (!fileGroups[baseName]) {
        fileGroups[baseName] = [];
      }
      fileGroups[baseName].push(file);
    }
  });
  
  // Find duplicates
  const duplicates = {};
  Object.keys(fileGroups).forEach(baseName => {
    if (fileGroups[baseName].length > 1) {
      duplicates[baseName] = fileGroups[baseName];
    }
  });
  
  console.log('\n Duplicate Analysis:');
  console.log(`Found ${Object.keys(duplicates).length} groups with duplicates`);
  
  Object.keys(duplicates).forEach(baseName => {
    console.log(`\n ${baseName}:`);
    duplicates[baseName].forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`   - ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB, ${stats.mtime.toISOString()})`);
    });
  });
  
  return { fileGroups, duplicates };
}

async function uploadDatabaseFiles() {
  console.log('\n Uploading files that are currently in the database...');
  
  const results = [];
  
  for (const dbFile of databaseFiles) {
    try {
      console.log(`\n Processing: ${dbFile.title}`);
      
      // Extract filename from URL
      const fileUrl = dbFile.fileUrl;
      const thumbnailUrl = dbFile.thumbnailUrl;
      
      const fileName = fileUrl.split('/').pop();
      const thumbnailName = thumbnailUrl.split('/').pop();
      
      console.log(`Audio file: ${fileName}`);
      console.log(`Thumbnail: ${thumbnailName}`);
      
      // Check if files exist locally
      const audioPath = `./uploads/${fileName}`;
      const thumbnailPath = `./uploads/${thumbnailName}`;
      
      if (!fs.existsSync(audioPath)) {
        console.log(`Audio file not found: ${audioPath}`);
        continue;
      }
      
      if (!fs.existsSync(thumbnailPath)) {
        console.log(`Thumbnail not found: ${thumbnailPath}`);
        continue;
      }
      
      // Create FormData for upload
      const formData = new FormData();
      
      // Add audio file
      const audioStream = fs.createReadStream(audioPath);
      formData.append('file', audioStream, {
        filename: fileName,
        contentType: fileName.endsWith('.mp3') ? 'audio/mpeg' : 'audio/wav'
      });
      
      // Add thumbnail
      const thumbnailStream = fs.createReadStream(thumbnailPath);
      formData.append('thumbnail', thumbnailStream, {
        filename: thumbnailName,
        contentType: 'image/png'
      });
      
      // Upload to production server
      console.log('Uploading to production server...');
      const uploadResponse = await axios.post(PRODUCTION_API_URL, formData, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          ...formData.getHeaders()
        },
        timeout: 60000
      });
      
      console.log('Upload successful!');
      console.log('Response:', uploadResponse.data);
      
      results.push({
        success: true,
        title: dbFile.title,
        response: uploadResponse.data
      });
      
    } catch (error) {
      console.error(`Error processing ${dbFile.title}:`, error.response?.data || error.message);
      results.push({
        success: false,
        title: dbFile.title,
        error: error.message
      });
    }
    
    // Wait between uploads
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}

async function main() {
  try {
    // Analyze duplicates
    const { duplicates } = analyzeDuplicates();
    
    // Upload database files
    const uploadResults = await uploadDatabaseFiles();
    
    // Summary
    console.log('\n Upload Summary:');
    const successful = uploadResults.filter(r => r.success).length;
    const failed = uploadResults.filter(r => !r.success).length;
    
    console.log(`Successful uploads: ${successful}`);
    console.log(`Failed uploads: ${failed}`);
    
    if (failed > 0) {
      console.log('\n Failed uploads:');
      uploadResults.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.title}: ${r.error}`);
      });
    }
    
    console.log('\n Process completed!');
    console.log('Now restart your Flutter app to test music playback');
    
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the analysis and upload
main();
