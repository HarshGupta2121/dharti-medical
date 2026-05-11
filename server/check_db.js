require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        console.log(`Found ${products.length} products`);
        if (products.length > 0) {
            console.log('Sample product image:', products[0].image);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
