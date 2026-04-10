// ============================================
// ShopVerse — Cart Logic (localStorage)
// ============================================

(function () {
  'use strict';

  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummaryContainer = document.getElementById('cart-summary');
  const emptyCartContainer = document.getElementById('empty-cart');

  if (!cartItemsContainer) return;

  function getCart() {
    return JSON.parse(localStorage.getItem('shopverse_cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('shopverse_cart', JSON.stringify(cart));
    updateCartBadge();
  }

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      cartItemsContainer.style.display = 'none';
      if (cartSummaryContainer) cartSummaryContainer.style.display = 'none';
      if (emptyCartContainer) emptyCartContainer.style.display = 'block';
      return;
    }

    cartItemsContainer.style.display = 'flex';
    if (cartSummaryContainer) cartSummaryContainer.style.display = 'block';
    if (emptyCartContainer) emptyCartContainer.style.display = 'none';

    // Render cart items
    cartItemsContainer.innerHTML = cart.map((item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Product'">
        </div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="price">${formatPrice(item.price)}</p>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button onclick="updateCartQuantity('${item.id}', -1)">−</button>
            <input type="number" value="${item.quantity}" readonly>
            <button onclick="updateCartQuantity('${item.id}', 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑 Remove</button>
        </div>
      </div>
    `).join('');

    // Render summary
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 1000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    if (cartSummaryContainer) {
      cartSummaryContainer.innerHTML = `
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal (${cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
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
        ${shipping > 0 ? '<p style="font-size:0.8rem;color:var(--text-muted);margin-top:var(--space-sm);">Free shipping on orders above ₹1,000</p>' : ''}
        <a href="checkout.html" class="btn btn-primary btn-lg" style="margin-top:var(--space-lg);">
          Proceed to Checkout →
        </a>
        <a href="products.html" class="btn btn-outline" style="margin-top:var(--space-sm);">
          Continue Shopping
        </a>
      `;
    }
  }

  // ── Update Quantity ──
  window.updateCartQuantity = function (itemId, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    saveCart(cart);
    renderCart();
  };

  // ── Remove Item ──
  window.removeFromCart = function (itemId) {
    let cart = getCart();
    const removed = cart.find((i) => i.id === itemId);
    cart = cart.filter((i) => i.id !== itemId);
    saveCart(cart);
    renderCart();
    if (removed) showToast(`${removed.name} removed from cart`, 'info');
  };

  // ── Clear Cart ──
  window.clearCart = function () {
    localStorage.removeItem('shopverse_cart');
    updateCartBadge();
    renderCart();
    showToast('Cart cleared', 'info');
  };

  renderCart();
})();
