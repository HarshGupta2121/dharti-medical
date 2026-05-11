const mongoose = require('mongoose');
const dotenv = require('dotenv');
const products = require('./data/products');
const Product = require('./models/Product');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medicare');
        console.log('MongoDB Connected');

        // Clear existing products
        await Product.deleteMany();
        console.log('Products Cleared');

        // We need an admin user to be the owner of the products
        const adminUser = await User.findOne({ isAdmin: true });

        // If no admin, just find ANY user, or create one if db is empty (assuming db has users)
        // For simplicity, we'll try to find one, else skip assigning or use null (if schema allows, but schema usually requires user)
        // Product schema typically: user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

        let sampleProducts;
        if (adminUser) {
            sampleProducts = products.map(product => {
                return { ...product, user: adminUser._id };
            });
        } else {
            // Fallback: try to find any user
            const anyUser = await User.findOne({});
            if (anyUser) {
                sampleProducts = products.map(product => {
                    return { ...product, user: anyUser._id };
                });
            } else {
                console.error('Error: No users found in database to assign products to. Please register a user first.');
                process.exit(1);
            }
        }

        await Product.insertMany(sampleProducts);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medicare');
        await Product.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
