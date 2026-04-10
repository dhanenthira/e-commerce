const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');

// POST /cart - Save/update cart for authenticated user
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.uid;

    await db.collection('carts').doc(userId).set({
      items: items || [],
      updatedAt: new Date().toISOString(),
    });

    res.json({ message: 'Cart saved successfully' });
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ error: 'Failed to save cart' });
  }
});

// GET /cart - Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const doc = await db.collection('carts').doc(userId).get();

    if (!doc.exists) {
      return res.json({ items: [] });
    }

    res.json(doc.data());
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

module.exports = router;
