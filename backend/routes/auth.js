const express = require('express');
const router = express.Router();
const { db, auth } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');

// POST /auth/register - Register user data in Firestore
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { displayName, email, phone } = req.body;
    const userId = req.user.uid;

    await db.collection('users').doc(userId).set({
      displayName: displayName || '',
      email: email || req.user.email,
      phone: phone || '',
      role: 'customer',
      wishlist: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// GET /auth/profile - Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.user.uid).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /auth/profile - Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { displayName, phone } = req.body;

    await db.collection('users').doc(req.user.uid).update({
      displayName,
      phone,
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /auth/wishlist - Toggle wishlist item
router.post('/wishlist', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.uid;

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    let wishlist = userData.wishlist || [];

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
    } else {
      wishlist.push(productId);
    }

    await db.collection('users').doc(userId).update({
      wishlist,
      updatedAt: new Date().toISOString(),
    });

    res.json({ wishlist });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

// GET /auth/wishlist - Get wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = userDoc.data().wishlist || [];

    // Fetch product details for wishlist items
    const products = [];
    for (const productId of wishlist) {
      const productDoc = await db.collection('products').doc(productId).get();
      if (productDoc.exists) {
        products.push({ id: productDoc.id, ...productDoc.data() });
      }
    }

    res.json({ wishlist: products });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

module.exports = router;
