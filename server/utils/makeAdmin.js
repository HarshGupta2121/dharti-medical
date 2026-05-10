const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: '../.env' });

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address. Usage: node makeAdmin.js <email>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medicare');
        console.log('MongoDB Connected');

        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();

        console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
