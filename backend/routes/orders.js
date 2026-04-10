const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Configure the email transporter using credentials from .env
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your App Password (not your main log-in password)
  },
});

// POST /orders - Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { items, shippingAddress, paymentId, totalAmount } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const orderData = {
      userId,
      items,
      shippingAddress,
      paymentId: paymentId || null,
      totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('orders').add(orderData);

    // Clear user's cart after successful order
    await db.collection('carts').doc(userId).delete();

    // Send an email notification to you (the Admin) about the new order
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const itemsList = items.map(item => `- ${item.name} (x${item.quantity}): ₹${item.price * item.quantity}`).join('\n');
      const addressString = `${shippingAddress.name}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode} (Phone: ${shippingAddress.phone})`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Sending it to your own email
        subject: `🎉 New Order Received! Order ID: ${docRef.id}`,
        text: `You have received a new order!\n\nProducts Purchased:\n${itemsList}\n\nTotal Paid: ₹${totalAmount}\n\nDelivery Details:\n${addressString}\n\nUser ID: ${userId}`
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Order notification email sent successfully!');
      } catch (emailError) {
        console.error('❌ Failed to send order email:', emailError);
      }
    } else {
      console.log('⚠️ Email notification skipped: EMAIL_USER or EMAIL_PASS not set in .env');
    }

    res.status(201).json({ orderId: docRef.id, ...orderData });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /orders - Get user's orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /orders/:id - Get single order
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = doc.data();
    if (order.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ id: doc.id, ...order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
