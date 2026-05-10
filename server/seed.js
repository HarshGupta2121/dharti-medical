const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicare')
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const products = require('./data/products');

const seedDB = async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Database Seeded Successfully with Design Data');
    mongoose.connection.close();
};

seedDB();
