const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products with pagination and search
router.get('/', async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 12;
        const page = Number(req.query.pageNumber) || 1;
        
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};
            
        const category = req.query.category && req.query.category !== 'All' 
            ? { category: req.query.category } 
            : {};

        const filter = { ...keyword, ...category };

        const count = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const { protect, admin } = require('../middleware/authMiddleware');

// DELETE product
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE product
router.post('/', protect, admin, async (req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
        dosage: 'Sample dosage'
    });

    try {
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// BULK UPDATE products
router.put('/bulk', protect, admin, async (req, res) => {
    try {
        const { products } = req.body; // Array of product objects { _id, name, price, category, brand, ... }
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ message: 'Invalid product data provided' });
        }

        const bulkOperations = products.map((prod) => ({
            updateOne: {
                filter: { _id: prod._id },
                update: {
                    $set: {
                        name: prod.name,
                        price: prod.price,
                        category: prod.category,
                        brand: prod.brand
                    }
                }
            }
        }));

        await Product.bulkWrite(bulkOperations);
        res.json({ message: 'Products updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE product
router.put('/:id', protect, admin, async (req, res) => {
    const { name, price, description, image, brand, category, countInStock, dosage } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.brand = brand;
            product.category = category;
            product.countInStock = countInStock;
            product.dosage = dosage;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
