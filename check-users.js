import mongoose from 'mongoose';
import User from './models/userModel.js';

const checkUsers = async () => {
  try {
    await mongoose.connect('mongodb+srv://211400117:UmarShoaib@cluster0.dl0ndhx.mongodb.net/music_demo?retryWrites=true&w=majority&appName=Cluster0&tls=true');
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'name email role');
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Check if any admin users exist
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`\nAdmin users found: ${adminUsers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
