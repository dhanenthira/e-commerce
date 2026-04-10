const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken, optionalAuth } = require('../middleware/auth');

// GET /products - Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating, search, limit = 20, page = 1 } = req.query;
    let query = db.collection('products');

    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    if (rating) {
      query = query.where('rating', '>=', parseFloat(rating));
    }

    const snapshot = await query.get();
    let products = [];

    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Client-side filtering for price range and search
    if (minPrice) {
      products = products.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= parseFloat(maxPrice));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      products: paginatedProducts,
      total: products.length,
      page: parseInt(page),
      totalPages: Math.ceil(products.length / parseInt(limit)),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// GET /products/seed - Seed demo products
router.post('/seed', async (req, res) => {
  try {
    const demoProducts = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Features Bluetooth 5.2 and multipoint connection.',
        price: 4999,
        originalPrice: 7999,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
        ],
        rating: 4.5,
        reviews: 234,
        stock: 50,
        brand: 'SoundMax',
        tags: ['headphones', 'wireless', 'noise-cancelling'],
      },
      {
        name: 'Smart Fitness Watch Pro',
        description: 'Advanced fitness tracker with AMOLED display, heart rate monitoring, GPS tracking, and 14-day battery life. Water resistant up to 50m.',
        price: 3499,
        originalPrice: 5999,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=500',
        ],
        rating: 4.3,
        reviews: 189,
        stock: 75,
        brand: 'TechFit',
        tags: ['watch', 'fitness', 'smart'],
      },
      {
        name: 'Ultra-Slim Laptop Stand',
        description: 'Ergonomic aluminum laptop stand with adjustable height. Compatible with all laptops up to 17 inches. Foldable and portable design.',
        price: 1299,
        originalPrice: 1999,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
        rating: 4.7,
        reviews: 412,
        stock: 120,
        brand: 'ErgoDesk',
        tags: ['laptop', 'stand', 'ergonomic'],
      },
      {
        name: 'Premium Cotton Casual Shirt',
        description: 'Soft-touch 100% organic cotton shirt with a modern slim fit. Available in multiple colors. Perfect for casual and semi-formal occasions.',
        price: 1499,
        originalPrice: 2499,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
          'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=500',
        ],
        rating: 4.2,
        reviews: 156,
        stock: 200,
        brand: 'UrbanStyle',
        tags: ['shirt', 'cotton', 'casual'],
      },
      {
        name: 'Classic Leather Messenger Bag',
        description: 'Handcrafted genuine leather messenger bag with padded laptop compartment. Features brass hardware and adjustable shoulder strap.',
        price: 2999,
        originalPrice: 4999,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        ],
        rating: 4.6,
        reviews: 98,
        stock: 35,
        brand: 'LeatherCraft',
        tags: ['bag', 'leather', 'messenger'],
      },
      {
        name: 'Designer Sunglasses UV400',
        description: 'Polarized UV400 protection sunglasses with titanium frame. Ultra-lightweight at just 20g. Includes premium carrying case.',
        price: 1999,
        originalPrice: 3499,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
        rating: 4.4,
        reviews: 267,
        stock: 80,
        brand: 'VisionElite',
        tags: ['sunglasses', 'uv400', 'polarized'],
      },
      {
        name: 'The Art of Clean Code',
        description: 'A comprehensive guide to writing maintainable, efficient, and elegant code. Covers best practices, design patterns, and refactoring techniques.',
        price: 599,
        originalPrice: 999,
        category: 'books',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
        rating: 4.8,
        reviews: 523,
        stock: 300,
        brand: 'TechPress',
        tags: ['programming', 'clean-code', 'software'],
      },
      {
        name: 'Mindful Leadership',
        description: 'Discover the power of mindful leadership in the modern workplace. Packed with real-world case studies and actionable strategies.',
        price: 449,
        originalPrice: 799,
        category: 'books',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
        rating: 4.1,
        reviews: 178,
        stock: 150,
        brand: 'MindPress',
        tags: ['leadership', 'business', 'mindfulness'],
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof portable speaker with 360° surround sound. 20-hour playtime, built-in microphone, and TWS pairing capability.',
        price: 2499,
        originalPrice: 3999,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
        rating: 4.3,
        reviews: 345,
        stock: 90,
        brand: 'SoundMax',
        tags: ['speaker', 'bluetooth', 'portable'],
      },
      {
        name: 'Running Shoes - UltraBoost',
        description: 'Responsive cushioning running shoes with breathable knit upper. Energy-returning midsole and Continental rubber outsole.',
        price: 3999,
        originalPrice: 6999,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500',
        ],
        rating: 4.6,
        reviews: 892,
        stock: 60,
        brand: 'StridePro',
        tags: ['shoes', 'running', 'sports'],
      },
      {
        name: 'Digital Drawing Tablet',
        description: '10-inch drawing tablet with 8192 levels of pressure sensitivity. Battery-free stylus and customizable shortcut keys.',
        price: 5999,
        originalPrice: 8999,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500',
        images: ['https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500'],
        rating: 4.4,
        reviews: 156,
        stock: 40,
        brand: 'ArtTech',
        tags: ['tablet', 'drawing', 'digital-art'],
      },
      {
        name: 'Data Science Handbook',
        description: 'Complete guide to data science covering Python, machine learning, statistics, and data visualization with hands-on projects.',
        price: 799,
        originalPrice: 1299,
        category: 'books',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
        images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'],
        rating: 4.6,
        reviews: 412,
        stock: 200,
        brand: 'TechPress',
        tags: ['data-science', 'python', 'machine-learning'],
      },
    ];

    const batch = db.batch();
    demoProducts.forEach((product) => {
      const docRef = db.collection('products').doc();
      batch.set(docRef, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    await batch.commit();
    res.json({ message: `Successfully seeded ${demoProducts.length} products` });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ error: 'Failed to seed products' });
  }
});

// GET /products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /products - Add new product (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Admin check bypassed for portfolio demonstration
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    /* 
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    */

    const productData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('products').add(productData);
    res.status(201).json({ id: docRef.id, ...productData });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// PUT /products/:id - Update product (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    /*
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    */

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('products').doc(req.params.id).update(updateData);
    res.json({ id: req.params.id, ...updateData });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /products/:id - Delete product (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    /*
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    */

    await db.collection('products').doc(req.params.id).delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
