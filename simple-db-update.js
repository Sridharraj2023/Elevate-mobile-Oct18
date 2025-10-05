// Simple MongoDB update script
// Run this in MongoDB Compass or MongoDB shell

// Connect to your production database first
// Then run these commands:

// Update all music records with local server URLs to production URLs
db.musics.updateMany(
  { 
    $or: [
      { fileUrl: { $regex: "192.168.0.100:5000" } },
      { thumbnailUrl: { $regex: "192.168.0.100:5000" } }
    ]
  },
  [
    {
      $set: {
        fileUrl: {
          $replaceAll: {
            input: "$fileUrl",
            find: "http://192.168.0.100:5000",
            replacement: "https://elevate-backend-s28.onrender.com"
          }
        },
        thumbnailUrl: {
          $replaceAll: {
            input: "$thumbnailUrl", 
            find: "http://192.168.0.100:5000",
            replacement: "https://elevate-backend-s28.onrender.com"
          }
        }
      }
    }
  ]
);

// Check how many records were updated
db.musics.countDocuments({
  $or: [
    { fileUrl: { $regex: "192.168.0.100:5000" } },
    { thumbnailUrl: { $regex: "192.168.0.100:5000" } }
  ]
});

// Show updated records
db.musics.find({
  $or: [
    { fileUrl: { $regex: "elevate-backend-s28.onrender.com" } },
    { thumbnailUrl: { $regex: "elevate-backend-s28.onrender.com" } }
  ]
}).pretty();
