// ============================================
// ShopVerse — Profile Page Logic
// ============================================

(function () {
  'use strict';

  const profileContent = document.getElementById('profile-content');
  if (!profileContent) return;

  // Check auth
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    renderProfile(user);
  });

  async function renderProfile(user) {
    const profileHeader = document.getElementById('profile-header');
    const initials = (user.displayName || user.email || 'U').charAt(0).toUpperCase();

    if (profileHeader) {
      profileHeader.innerHTML = `
        <div class="profile-avatar">${initials}</div>
        <div class="profile-info">
          <h1>${user.displayName || 'ShopVerse User'}</h1>
          <p>${user.email}</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="handleLogout()" style="margin-left:auto;">Logout</button>
      `;
    }

    // Default to orders tab
    showTab('orders');
  }

  // ── Tab Navigation ──
  window.showTab = function (tab) {
    document.querySelectorAll('.profile-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    switch (tab) {
      case 'orders': renderOrders(); break;
      case 'wishlist': renderWishlist(); break;
      case 'settings': renderSettings(); break;
    }
  };

  // ── Orders Tab ──
  async function renderOrders() {
    profileContent.innerHTML = '<div style="text-align:center;padding:var(--space-xl);"><div class="inline-spinner"></div> Loading orders...</div>';

    let orders = [];

    try {
      const data = await apiRequest('/orders');
      orders = data.orders || [];
    } catch (error) {
      // Fallback to local orders
      orders = JSON.parse(localStorage.getItem('shopverse_orders') || '[]');
    }

    if (orders.length === 0) {
      profileContent.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <a href="products.html" class="btn btn-primary" style="margin-top:var(--space-lg);">Browse Products</a>
        </div>
      `;
      return;
    }

    profileContent.innerHTML = `
      <div class="orders-list">
        ${orders.map((order) => `
          <div class="order-card">
            <div class="order-header">
              <div>
                <span class="order-id">Order #${(order.id || order.orderId || '').slice(-8).toUpperCase()}</span>
                <span style="color:var(--text-muted);font-size:0.85rem;margin-left:var(--space-md);">
                  ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <span class="order-status ${order.status}">${order.status || 'confirmed'}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:var(--space-sm);margin-top:var(--space-md);">
              ${(order.items || []).map((item) => `
                <div style="display:flex;justify-content:space-between;padding:var(--space-sm) 0;border-bottom:1px solid var(--border);">
                  <span style="color:var(--text-secondary);">${item.name} × ${item.quantity}</span>
                  <span style="font-weight:600;">${formatPrice(item.price * item.quantity)}</span>
                </div>
              `).join('')}
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:var(--space-md);padding-top:var(--space-md);border-top:1px solid var(--border);">
              <span style="font-weight:700;">Total</span>
              <span style="font-weight:700;color:var(--accent);">${formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ── Wishlist Tab ──
  async function renderWishlist() {
    const wishlistIds = JSON.parse(localStorage.getItem('shopverse_wishlist') || '[]');

    if (wishlistIds.length === 0) {
      profileContent.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">💝</div>
          <h2>Wishlist is empty</h2>
          <p>Save items you love to your wishlist</p>
          <a href="products.html" class="btn btn-primary" style="margin-top:var(--space-lg);">Browse Products</a>
        </div>
      `;
      return;
    }

    // Fetch product details
    let products = [];
    try {
      const data = await apiRequest('/products');
      products = (data.products || []).filter((p) => wishlistIds.includes(p.id));
    } catch {
      // Use demo data
      const demoAll = [
        { id: 'demo-1', name: 'Wireless Noise-Cancelling Headphones', price: 4999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', category: 'electronics' },
        { id: 'demo-2', name: 'Smart Fitness Watch Pro', price: 3499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', category: 'electronics' },
        { id: 'demo-3', name: 'Ultra-Slim Laptop Stand', price: 1299, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', category: 'electronics' },
        { id: 'demo-4', name: 'Premium Cotton Casual Shirt', price: 1499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300', category: 'fashion' },
        { id: 'demo-5', name: 'Classic Leather Messenger Bag', price: 2999, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300', category: 'fashion' },
        { id: 'demo-6', name: 'Designer Sunglasses UV400', price: 1999, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300', category: 'fashion' },
      ];
      products = demoAll.filter((p) => wishlistIds.includes(p.id));
    }

    if (products.length === 0) {
      // Wishlist items exist but no product data available
      profileContent.innerHTML = `
        <div class="empty-cart">
          <div class="empty-icon">💝</div>
          <h2>${wishlistIds.length} item(s) in wishlist</h2>
          <p>View products to see your wishlisted items</p>
          <a href="products.html" class="btn btn-primary" style="margin-top:var(--space-lg);">Browse Products</a>
        </div>
      `;
      return;
    }

    profileContent.innerHTML = `
      <div class="products-grid">
        ${products.map((p) => `
          <div class="product-card">
            <div class="product-image">
              <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
              <div class="product-category">${p.category}</div>
              <h3 class="product-name">${p.name}</h3>
              <div class="product-price">
                <span class="current">${formatPrice(p.price)}</span>
              </div>
              <div class="product-actions">
                <a href="product-detail.html?id=${p.id}" class="btn btn-outline btn-sm">View</a>
                <button class="btn btn-danger btn-sm" onclick="removeWishlistItem('${p.id}')">Remove</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.removeWishlistItem = function (id) {
    let wishlist = JSON.parse(localStorage.getItem('shopverse_wishlist') || '[]');
    wishlist = wishlist.filter((wid) => wid !== id);
    localStorage.setItem('shopverse_wishlist', JSON.stringify(wishlist));
    showToast('Removed from wishlist', 'info');
    renderWishlist();
  };

  // ── Settings Tab ──
  function renderSettings() {
    const user = firebase.auth().currentUser;

    profileContent.innerHTML = `
      <div class="checkout-form-section" style="max-width:600px;">
        <h2>Account Settings</h2>
        <form id="settings-form">
          <div class="form-group">
            <label>Display Name</label>
            <input type="text" class="form-input" id="settings-name" value="${user?.displayName || ''}" placeholder="Your name">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-input" value="${user?.email || ''}" disabled style="opacity:0.6;">
            <small style="color:var(--text-muted);font-size:0.8rem;">Email cannot be changed</small>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" class="form-input" id="settings-phone" placeholder="+91 XXXXX XXXXX">
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
      </div>
    `;

    document.getElementById('settings-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('settings-name').value.trim();
      const phone = document.getElementById('settings-phone').value.trim();

      showSpinner();
      try {
        await user.updateProfile({ displayName: name });
        try {
          await apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ displayName: name, phone }),
          });
        } catch { }
        hideSpinner();
        showToast('Profile updated!', 'success');
      } catch (error) {
        hideSpinner();
        showToast('Failed to update profile', 'error');
      }
    });
  }
})();
