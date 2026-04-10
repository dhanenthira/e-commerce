// ============================================
// ShopVerse — Checkout Logic + Razorpay
// ============================================

(function () {
  'use strict';

  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSummary = document.getElementById('checkout-summary');

  if (!checkoutForm || !checkoutSummary) return;

  const cart = JSON.parse(localStorage.getItem('shopverse_cart') || '[]');

  if (cart.length === 0) {
    document.querySelector('.checkout-layout').innerHTML = `
      <div class="empty-cart" style="grid-column:1/-1;">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out</p>
        <a href="products.html" class="btn btn-primary" style="margin-top:var(--space-lg);">Browse Products</a>
      </div>
    `;
    return;
  }

  // Render checkout summary
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  checkoutSummary.innerHTML = `
    <h2>Order Summary</h2>
    ${cart.map(item => `
      <div style="display:flex;justify-content:space-between;padding:var(--space-sm) 0;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-weight:600;font-size:0.9rem;">${item.name}</div>
          <div style="color:var(--text-muted);font-size:0.8rem;">Qty: ${item.quantity}</div>
        </div>
        <span style="font-weight:600;">${formatPrice(item.price * item.quantity)}</span>
      </div>
    `).join('')}
    <div class="summary-row" style="margin-top:var(--space-md);">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>${shipping === 0 ? '<span style="color:var(--accent)">FREE</span>' : formatPrice(shipping)}</span>
    </div>
    <div class="summary-row">
      <span>Tax (18% GST)</span>
      <span>${formatPrice(tax)}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
  `;

  // Handle checkout
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = firebase.auth().currentUser;
    if (!user) {
      showToast('Please login to place an order', 'error');
      setTimeout(() => window.location.href = 'login.html', 1000);
      return;
    }

    const shippingAddress = {
      fullName: document.getElementById('checkout-name').value.trim(),
      email: document.getElementById('checkout-email').value.trim(),
      phone: document.getElementById('checkout-phone').value.trim(),
      address: document.getElementById('checkout-address').value.trim(),
      city: document.getElementById('checkout-city').value.trim(),
      state: document.getElementById('checkout-state').value.trim(),
      pincode: document.getElementById('checkout-pincode').value.trim(),
    };

    // Validate
    for (const [key, value] of Object.entries(shippingAddress)) {
      if (!value) {
        showToast(`Please fill in ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
        return;
      }
    }

    showSpinner();

    try {
      // Razorpay has been removed. Place the order directly as Cash on Delivery / Direct Order.
      const paymentId = 'cod_' + Date.now();
      await placeOrder(shippingAddress, paymentId, total);
    } catch (error) {
      hideSpinner();
      showToast('Failed to process order.', 'error');
    }
  });

  async function placeOrder(shippingAddress, paymentId, totalAmount) {
    showSpinner();
    try {
      const orderData = {
        items: cart,
        shippingAddress,
        paymentId,
        totalAmount,
      };

      try {
        await apiRequest('/orders', {
          method: 'POST',
          body: JSON.stringify(orderData),
        });
      } catch (apiError) {
        console.warn('Order API failed, saving locally:', apiError.message);
        // Save order locally as backup
        const localOrders = JSON.parse(localStorage.getItem('shopverse_orders') || '[]');
        localOrders.push({
          id: 'local_' + Date.now(),
          ...orderData,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('shopverse_orders', JSON.stringify(localOrders));
      }

      // Clear cart
      localStorage.removeItem('shopverse_cart');
      updateCartBadge();

      hideSpinner();

      // Store order ID for success page
      localStorage.setItem('shopverse_last_order', paymentId);

      window.location.href = 'order-success.html';
    } catch (error) {
      hideSpinner();
      showToast('Failed to place order. Please try again.', 'error');
    }
  }
})();
