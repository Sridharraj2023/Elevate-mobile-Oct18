// Add this to your backend routes/musicRoutes.js

// @desc    Update database URLs from local to production
// @route   POST /api/music/update-urls
// @access  Private (Admin only)
router.post('/update-urls', protect, adminOnly, async (req, res) => {
  try {
    console.log('🔄 Starting database URL update...');
    
    // Find all music records with local server URLs
    const localServerPattern = /192\.168\.0\.100:5000/;
    const musicRecords = await Music.find({
      $or: [
        { fileUrl: { $regex: localServerPattern } },
        { thumbnailUrl: { $regex: localServerPattern } }
      ]
    });

    console.log(`📊 Found ${musicRecords.length} records with local server URLs`);

    if (musicRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No records found with local server URLs. Database is already up to date!',
        updatedCount: 0
      });
    }

    let updatedCount = 0;

    for (const music of musicRecords) {
      console.log(`🎵 Processing: ${music.title}`);
      
      let needsUpdate = false;
      const updateData = {};

      // Update fileUrl if it contains local server URL
      if (music.fileUrl && music.fileUrl.includes('192.168.0.100:5000')) {
        const newFileUrl = music.fileUrl.replace(
          'http://192.168.0.100:5000',
          'https://elevate-backend-s28.onrender.com'
        );
        updateData.fileUrl = newFileUrl;
        needsUpdate = true;
        console.log(`   ✅ New fileUrl: ${newFileUrl}`);
      }

      // Update thumbnailUrl if it contains local server URL
      if (music.thumbnailUrl && music.thumbnailUrl.includes('192.168.0.100:5000')) {
        const newThumbnailUrl = music.thumbnailUrl.replace(
          'http://192.168.0.100:5000',
          'https://elevate-backend-s28.onrender.com'
        );
        updateData.thumbnailUrl = newThumbnailUrl;
        needsUpdate = true;
        console.log(`   ✅ New thumbnailUrl: ${newThumbnailUrl}`);
      }

      // Update the record if changes were made
      if (needsUpdate) {
        await Music.findByIdAndUpdate(music._id, updateData);
        updatedCount++;
        console.log(`   ✅ Updated record: ${music.title}`);
      }
    }

    console.log(`📊 Update Summary: ${updatedCount} records updated`);

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} records`,
      updatedCount: updatedCount,
      totalFound: musicRecords.length
    });

  } catch (error) {
    console.error('❌ Error updating database URLs:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating database URLs',
      error: error.message
    });
  }
});
