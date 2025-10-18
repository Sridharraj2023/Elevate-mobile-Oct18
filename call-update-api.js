import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const API_URL = process.env.API_URL || 'https://elevate-backend-s28.onrender.com/api/music/update-urls';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error(' ADMIN_TOKEN is not set in environment variables');
  process.exit(1);
}

async function updateDatabaseUrls() {
  try {
    console.log(' Calling database URL update API...');
    console.log(` API URL: ${API_URL}`);
    }

    const response = await axios.post(API_URL, {}, {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(' Database URLs updated successfully!');
    console.log(' Response:', response.data);
    
    if (response.data.success) {
      console.log(` Updated ${response.data.updatedCount} records`);
      console.log(' Now restart your Flutter app to test music playback');
    }

  } catch (error) {
    console.error(' Error updating database URLs:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log(' Authentication failed. Please check your admin token.');
    } else if (error.response?.status === 403) {
      console.log(' Access denied. Make sure you are logged in as admin.');
    }
  }
}

// Run the update
updateDatabaseUrls();
