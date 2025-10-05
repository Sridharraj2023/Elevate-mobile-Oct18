import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Configuration
const PRODUCTION_API_URL = 'https://elevate-backend-s28.onrender.com/api/music/upload';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWU0NDE1NDgyYzM5MjZiOWUzMzYzYiIsImlhdCI6MTc1OTY1MjAwNSwiZXhwIjoxNzU5NzYwMDA1fQ.6L6yKWByMBu1IzSHnwCYHBnbenVWd6M72JOmnIPniB0';

// Files that actually exist in the uploads directory (from the analysis)
const existingFiles = [
  {
    title: 'Udit-Narayan-Alka-Yagnik-Best-Hindi-Song',
    audioFile: '1743967747415-583304618_Kya-Dil-Ne-Kaha---Udit-Narayan-Alka-Yagnik-Best-Hindi-Song.mp3',
    thumbnailFile: '1743967754148-465867921_faviconpng.jpg'
  },
  {
    title: 'Super-Human-Sleep',
    audioFile: '1744163408681-706526750_963-and-2hz-Super-Human-Sleep.wav',
    thumbnailFile: '1743967754148-465867921_faviconpng.jpg' // Using the same thumbnail
  },
  {
    title: 'Deepmedi',
    audioFile: '1744171745218-801987053_deepmedi.wav',
    thumbnailFile: '1745716639415-502869343_12Hz.png'
  }
];

async function uploadExistingFiles() {
  console.log('🚀 Uploading files that actually exist in the uploads directory...');
  
  const results = [];
  
  for (const fileInfo of existingFiles) {
    try {
      console.log(`\n🔄 Processing: ${fileInfo.title}`);
      
      const audioPath = `./uploads/${fileInfo.audioFile}`;
      const thumbnailPath = `./uploads/${fileInfo.thumbnailFile}`;
      
      console.log(`   📁 Audio file: ${fileInfo.audioFile}`);
      console.log(`   🖼️ Thumbnail: ${fileInfo.thumbnailFile}`);
      
      // Check if files exist locally
      if (!fs.existsSync(audioPath)) {
        console.log(`   ❌ Audio file not found: ${audioPath}`);
        continue;
      }
      
      if (!fs.existsSync(thumbnailPath)) {
        console.log(`   ❌ Thumbnail not found: ${thumbnailPath}`);
        continue;
      }
      
      // Get file stats
      const audioStats = fs.statSync(audioPath);
      const thumbnailStats = fs.statSync(thumbnailPath);
      
      console.log(`   📊 Audio size: ${(audioStats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   📊 Thumbnail size: ${(thumbnailStats.size / 1024 / 1024).toFixed(2)} MB`);
      
      // Create FormData for upload
      const formData = new FormData();
      
      // Add audio file
      const audioStream = fs.createReadStream(audioPath);
      const audioContentType = fileInfo.audioFile.endsWith('.mp3') ? 'audio/mpeg' : 'audio/wav';
      formData.append('file', audioStream, {
        filename: fileInfo.audioFile,
        contentType: audioContentType
      });
      
      // Add thumbnail
      const thumbnailStream = fs.createReadStream(thumbnailPath);
      const thumbnailContentType = fileInfo.thumbnailFile.endsWith('.png') ? 'image/png' : 'image/jpeg';
      formData.append('thumbnail', thumbnailStream, {
        filename: fileInfo.thumbnailFile,
        contentType: thumbnailContentType
      });
      
      // Upload to production server
      console.log('   📤 Uploading to production server...');
      const uploadResponse = await axios.post(PRODUCTION_API_URL, formData, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          ...formData.getHeaders()
        },
        timeout: 120000 // 2 minutes timeout for large files
      });
      
      console.log('   ✅ Upload successful!');
      console.log('   📊 Response:', uploadResponse.data);
      
      results.push({
        success: true,
        title: fileInfo.title,
        response: uploadResponse.data
      });
      
    } catch (error) {
      console.error(`   ❌ Error processing ${fileInfo.title}:`, error.response?.data || error.message);
      results.push({
        success: false,
        title: fileInfo.title,
        error: error.message
      });
    }
    
    // Wait between uploads
    console.log('   ⏳ Waiting 3 seconds before next upload...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  return results;
}

async function main() {
  try {
    console.log('🔍 Uploading files that actually exist in the uploads directory...');
    console.log(`📊 Total files to upload: ${existingFiles.length}`);
    
    const uploadResults = await uploadExistingFiles();
    
    // Summary
    console.log('\n📊 Upload Summary:');
    const successful = uploadResults.filter(r => r.success).length;
    const failed = uploadResults.filter(r => !r.success).length;
    
    console.log(`✅ Successful uploads: ${successful}`);
    console.log(`❌ Failed uploads: ${failed}`);
    
    if (successful > 0) {
      console.log('\n✅ Successfully uploaded:');
      uploadResults.filter(r => r.success).forEach(r => {
        console.log(`   - ${r.title}`);
      });
    }
    
    if (failed > 0) {
      console.log('\n❌ Failed uploads:');
      uploadResults.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.title}: ${r.error}`);
      });
    }
    
    console.log('\n🎉 Upload process completed!');
    console.log('🔄 Now restart your Flutter app to test music playback');
    console.log('💡 The files are now available on the production server!');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the upload process
main();
