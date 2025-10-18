const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import Music model
const Music = require('./models/Music');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Update database URLs from local server to production server
const updateDatabaseUrls = async () => {
  try {
    console.log('Starting database URL update process...');
    
    // Find all music records with local server URLs
    const localServerPattern = /http:\/\/192\.168\.0\.100:5000\/uploads\//;
    const musicRecords = await Music.find({
      $or: [
        { fileUrl: { $regex: localServerPattern } },
        { thumbnailUrl: { $regex: localServerPattern } }
      ]
    });

    console.log(`Found ${musicRecords.length} records with local server URLs`);

    if (musicRecords.length === 0) {
      console.log('No records found with local server URLs. Database is already up to date!');
      return;
    }

    let updatedCount = 0;

    for (const music of musicRecords) {
      console.log(`\n Processing: ${music.title}`);
      console.log(`Current fileUrl: ${music.fileUrl}`);
      console.log(`Current thumbnailUrl: ${music.thumbnailUrl}`);

      let needsUpdate = false;
      const updateData = {};

      // Update fileUrl if it contains local server URL
      if (music.fileUrl && music.fileUrl.includes('192.168.0.100:5000')) {
        const newFileUrl = music.fileUrl.replace(
          'http://192.168.0.100:5000/uploads/',
          'https://elevate-backend-s28.onrender.com/uploads/'
        );
        updateData.fileUrl = newFileUrl;
        needsUpdate = true;
        console.log(`New fileUrl: ${newFileUrl}`);
      }

      // Update thumbnailUrl if it contains local server URL
      if (music.thumbnailUrl && music.thumbnailUrl.includes('192.168.0.100:5000')) {
        const newThumbnailUrl = music.thumbnailUrl.replace(
          'http://192.168.0.100:5000/uploads/',
          'https://elevate-backend-s28.onrender.com/uploads/'
        );
        updateData.thumbnailUrl = newThumbnailUrl;
        needsUpdate = true;
        console.log(`New thumbnailUrl: ${newThumbnailUrl}`);
      }

      // Update the record if changes were made
      if (needsUpdate) {
        await Music.findByIdAndUpdate(music._id, updateData);
        updatedCount++;
        console.log(`Updated record: ${music.title}`);
      } else {
        console.log(`No changes needed for: ${music.title}`);
      }
    }

    console.log(`\n Update Summary:`);
    console.log(`Successfully updated: ${updatedCount} records`);
    console.log(`No changes needed: ${musicRecords.length - updatedCount} records`);

    if (updatedCount > 0) {
      console.log('\n Database URLs updated successfully!');
      console.log('Restart your Flutter app to test the music playback');
    }

  } catch (error) {
    console.error('Error updating database URLs:', error);
  }
};

// Alternative: Update to relative URLs (recommended for better flexibility)
const updateToRelativeUrls = async () => {
  try {
    console.log('Starting database URL update to relative paths...');
    
    const localServerPattern = /http:\/\/192\.168\.0\.100:5000\/uploads\//;
    const musicRecords = await Music.find({
      $or: [
        { fileUrl: { $regex: localServerPattern } },
        { thumbnailUrl: { $regex: localServerPattern } }
      ]
    });

    console.log(`Found ${musicRecords.length} records with local server URLs`);

    if (musicRecords.length === 0) {
      console.log(' No records found with local server URLs. Database is already up to date!');
      return;
    }

    let updatedCount = 0;

    for (const music of musicRecords) {
      console.log(`\n Processing: ${music.title}`);
      
      let needsUpdate = false;
      const updateData = {};

      // Update fileUrl to relative path
      if (music.fileUrl && music.fileUrl.includes('192.168.0.100:5000')) {
        const fileName = music.fileUrl.split('/').pop();
        updateData.fileUrl = `/uploads/${fileName}`;
        needsUpdate = true;
        console.log(`    New fileUrl: ${updateData.fileUrl}`);
      }

      // Update thumbnailUrl to relative path
      if (music.thumbnailUrl && music.thumbnailUrl.includes('192.168.0.100:5000')) {
        const fileName = music.thumbnailUrl.split('/').pop();
        updateData.thumbnailUrl = `/uploads/${fileName}`;
        needsUpdate = true;
        console.log(`    New thumbnailUrl: ${updateData.thumbnailUrl}`);
      }

      if (needsUpdate) {
        await Music.findByIdAndUpdate(music._id, updateData);
        updatedCount++;
        console.log(`    Updated record: ${music.title}`);
      }
    }

    console.log(`\n Update Summary:`);
    console.log(` Successfully updated: ${updatedCount} records to relative URLs`);
    console.log(' Database now uses relative URLs for better flexibility!');

  } catch (error) {
    console.error(' Error updating to relative URLs:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  console.log('\n Choose update method:');
  console.log('1. Update to full production URLs (https://elevate-backend-s28.onrender.com/uploads/)');
  console.log('2. Update to relative URLs (/uploads/) - Recommended');
  
  // For now, let's use relative URLs (option 2) as it's more flexible
  console.log('\n Using relative URLs (recommended)...');
  await updateToRelativeUrls();
  
  // Close database connection
  await mongoose.connection.close();
  console.log('\n Database connection closed');
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Run the script
main();
