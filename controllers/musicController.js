// controllers/musicController.js
import Music from "../models/Music.js";
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// @desc    Get music by category
// @route   GET /api/music/category/:categoryId
// @access  Public
const getMusicByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    console.log(`Fetching music for category: ${categoryId}`);
    const musicList = await Music.find({ category: categoryId }).populate({
      path: 'category',
      select: 'name description types',
    });

    if (!musicList.length) {
      return res.status(404).json({ message: 'No music found for this category' });
    }

    const musicWithUrls = musicList.map(music => {
      // Always return relative URLs so clients can prepend their own base
      const fileName = music.fileUrl ? path.basename(music.fileUrl) : null;
      const thumbnailName = music.thumbnailUrl ? path.basename(music.thumbnailUrl) : null;

      let categoryTypeDetails = null;
      if (music.category && music.categoryType && music.category.types) {
        categoryTypeDetails = music.category.types.find(type => 
          type._id.toString() === music.categoryType.toString()
        );
      }

      return {
        ...music._doc,
        fileUrl: fileName ? `/uploads/${fileName}` : null,
        thumbnailUrl: thumbnailName ? `/uploads/${thumbnailName}` : null,
        category: music.category ? {
          _id: music.category._id,
          name: music.category.name,
          description: music.category.description,
        } : null,
        categoryType: categoryTypeDetails || null,
      };
    });

    console.log('Music with URLs by category:', musicWithUrls);
    res.json(musicWithUrls);
  } catch (error) {
    console.error('Error in getMusicByCategory:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
// @desc    Get all music with category and type details
// @route   GET /api/music
// @access  Public
// controllers/musicController.js
const getMusic = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching music from database...');
    const musicList = await Music.find().populate({
      path: 'category',
      select: 'name description types',
    });

    const musicWithUrls = musicList.map(music => {
      // Always return relative URLs so clients can prepend their own base
      const fileName = music.fileUrl ? path.basename(music.fileUrl) : null;
      const thumbnailName = music.thumbnailUrl ? path.basename(music.thumbnailUrl) : null;

      // Safely handle categoryType lookup
      let categoryTypeDetails = null;
      if (music.category && music.categoryType && music.category.types) {
        categoryTypeDetails = music.category.types.find(type => 
          type._id.toString() === music.categoryType.toString()
        );
      }

      return {
        ...music._doc,
        fileUrl: fileName ? `/uploads/${fileName}` : null,
        thumbnailUrl: thumbnailName ? `/uploads/${thumbnailName}` : null,
        category: music.category ? {
          _id: music.category._id,
          name: music.category.name,
          description: music.category.description,
        } : null, // Handle null category
        categoryType: categoryTypeDetails,
      };
    });

    console.log('Music with URLs:', musicWithUrls);
    res.json(musicWithUrls);
  } catch (error) {
    console.error('Error in getMusic:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @desc    Create new music with file and thumbnail upload
// @route   POST /api/music/create
// @access  Private/Admin
const createMusic = asyncHandler(async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Files:', req.files);
  const { title, artist, category, categoryType, duration, releaseDate } = req.body;
  const audioFile = req.files?.file?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  // Validate required fields
  const missingFields = [];
  if (!title) missingFields.push('title');
  if (!artist) missingFields.push('artist');
  if (!category) missingFields.push('category');
  if (!categoryType) missingFields.push('categoryType'); // Add this
  if (!audioFile) missingFields.push('file');
  if (!duration) missingFields.push('duration');
  if (!releaseDate) missingFields.push('releaseDate');

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Missing required fields",
      missing: missingFields
    });
  }

  try {
    const musicData = {
      title,
      artist,
      category: new mongoose.Types.ObjectId(category),
      categoryType: new mongoose.Types.ObjectId(categoryType), // Always set since validated
      fileUrl: `/uploads/${audioFile.filename}`,
      duration: Number(duration),
      releaseDate: new Date(releaseDate),
      user: req.user._id,
    };

    if (thumbnailFile) {
      musicData.thumbnailUrl = `/uploads/${thumbnailFile.filename}`;
    }

    console.log('Creating music with data:', musicData); // Log before creation
    const music = await Music.create(musicData);
    const populatedMusic = await Music.findById(music._id).populate('category', 'name description');
    res.status(201).json(populatedMusic);
  } catch (error) {
    console.error('Create music error:', error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

// @desc    Update music
// @route   PUT /api/music/:id
// @access  Private/Admin
const updateMusic = asyncHandler(async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }

    // Allow direct URL updates (admin metadata fix without re-uploading files)
    if (req.body.fileUrl) {
      music.fileUrl = req.body.fileUrl;
    }
    if (req.body.thumbnailUrl) {
      music.thumbnailUrl = req.body.thumbnailUrl;
    }

    // Handle file uploads (if provided)
    const audioFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Update fields
    music.title = req.body.title || music.title;
    music.artist = req.body.artist || music.artist;
    music.category = req.body.category ? new mongoose.Types.ObjectId(req.body.category) : music.category;
    music.categoryType = req.body.categoryType ? new mongoose.Types.ObjectId(req.body.categoryType) : music.categoryType;
    music.duration = req.body.duration || music.duration;
    music.releaseDate = req.body.releaseDate || music.releaseDate;

    if (audioFile) {
      if (music.fileUrl) {
        const oldFilePath = path.join(__dirname, '../uploads', path.basename(music.fileUrl));
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      music.fileUrl = `/uploads/${audioFile.filename}`;
    }

    if (thumbnailFile) {
      if (music.thumbnailUrl) {
        const oldThumbPath = path.join(__dirname, '../uploads', path.basename(music.thumbnailUrl));
        if (fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath);
        }
      }
      music.thumbnailUrl = `/uploads/${thumbnailFile.filename}`;
    }

    const updatedMusic = await music.save();
    const populatedMusic = await Music.findById(updatedMusic._id).populate('category', 'name description');
    res.json(populatedMusic);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: 'Server Error',
      error: error.message 
    });
  }
});

// @desc    Delete music
// @route   DELETE /api/music/:id
// @access  Private/Admin
const deleteMusic = asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id);
  if (!music) {
    res.status(404);
    throw new Error('Music not found');
  }
  
  // Clean up files
  if (music.fileUrl) {
    const filePath = path.join(__dirname, '../uploads', path.basename(music.fileUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  if (music.thumbnailUrl) {
    const thumbPath = path.join(__dirname, '../uploads', path.basename(music.thumbnailUrl));
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
  }

  await Music.findByIdAndDelete(req.params.id);
  res.json({ message: 'Music deleted successfully' });
});

// @desc    Upload a single file (for bulk upload)
// @route   POST /api/music/upload
// @access  Private/Admin
const uploadFile = asyncHandler(async (req, res) => {
  try {
    // The upload middleware uses .fields() so files are in req.files
    const audioFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    
    if (!audioFile && !thumbnailFile) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    // Return the first available file (audio takes priority)
    const uploadedFile = audioFile || thumbnailFile;
    const fileUrl = `/uploads/${uploadedFile.filename}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
      filename: uploadedFile.filename,
      fieldname: uploadedFile.fieldname
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: error.message 
    });
  }
});

// @desc    Update database URLs from local to production
// @route   POST /api/music/update-urls
// @access  Private (Admin only)
const updateDatabaseUrls = asyncHandler(async (req, res) => {
  try {
    console.log(' Starting database URL update...');
    
    // Find all music records with local server URLs
    const localServerPattern = /192\.168\.0\.100/;
    const musicRecords = await Music.find({
      $or: [
        { fileUrl: { $regex: localServerPattern } },
        { thumbnailUrl: { $regex: localServerPattern } }
      ]
    });

    console.log(` Found ${musicRecords.length} records with local server URLs`);

    if (musicRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No records found with local server URLs. Database is already up to date!',
        updatedCount: 0
      });
    }

    let updatedCount = 0;

    for (const music of musicRecords) {
      console.log(`Processing: ${music.title}`);
      
      let needsUpdate = false;
      const updateData = {};

      // Update fileUrl if it contains local server URL
      if (music.fileUrl && music.fileUrl.includes('192.168.0.100')) {
        const newFileUrl = music.fileUrl.replace(
          'http://192.168.0.100:5000',
          'https://elevate-backend-s28.onrender.com'
        );
        updateData.fileUrl = newFileUrl;
        needsUpdate = true;
        console.log(`   New fileUrl: ${newFileUrl}`);
      }

      // Update thumbnailUrl if it contains local server URL
      if (music.thumbnailUrl && music.thumbnailUrl.includes('192.168.0.100')) {
        const newThumbnailUrl = music.thumbnailUrl.replace(
          'http://192.168.0.100:5000',
          'https://elevate-backend-s28.onrender.com'
        );
        updateData.thumbnailUrl = newThumbnailUrl;
        needsUpdate = true;
        console.log(`   New thumbnailUrl: ${newThumbnailUrl}`);
      }

      // Update the record if changes were made
      if (needsUpdate) {
        await Music.findByIdAndUpdate(music._id, updateData);
        updatedCount++;
        console.log(`   Updated record: ${music.title}`);
      }
    }

    console.log(` Update Summary: ${updatedCount} records updated`);

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} records`,
      updatedCount: updatedCount,
      totalFound: musicRecords.length
    });

  } catch (error) {
    console.error('Error updating database URLs:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating database URLs',
      error: error.message
    });
  }
});

export { getMusic, getMusicByCategory, createMusic, updateMusic, deleteMusic, uploadFile, updateDatabaseUrls };