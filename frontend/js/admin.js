// ============================================
// ShopVerse — Admin Panel Logic
// ============================================

(function () {
  'use strict';

  const adminContent = document.getElementById('admin-content');
  if (!adminContent) return;

  // Auth check
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    loadAdmin();
  });

  async function loadAdmin() {
    renderStats();
    setupProductForm();
    loadProductList();
  }

  function renderStats() {
    const statsContainer = document.getElementById('admin-stats');
    if (!statsContainer) return;

    // Demo stats
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">12</div>
        <div class="stat-label">Products</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">48</div>
        <div class="stat-label">Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">₹2.4L</div>
        <div class="stat-label">Revenue</div>
      </div>
    `;
  }

  function setupProductForm() {
    const form = document.getElementById('add-product-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const productData = {
        name: document.getElementById('product-name-input').value.trim(),
        description: document.getElementById('product-desc-input').value.trim(),
        price: parseFloat(document.getElementById('product-price-input').value),
        originalPrice: parseFloat(document.getElementById('product-original-price-input').value) || 0,
        category: document.getElementById('product-category-input').value,
        image: document.getElementById('product-image-input').value.trim(),
        brand: document.getElementById('product-brand-input').value.trim(),
        stock: parseInt(document.getElementById('product-stock-input').value) || 100,
        rating: 4.0,
        reviews: 0,
      };

      if (!productData.name || !productData.price || !productData.category) {
        showToast('Please fill in required fields', 'error');
        return;
      }

      showSpinner();
      try {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        });
        hideSpinner();
        showToast('Product added successfully!', 'success');
        form.reset();
        loadProductList();
      } catch (error) {
        hideSpinner();
        showToast('Failed to add product: ' + error.message, 'error');
      }
    });
  }

  async function loadProductList() {
    const listContainer = document.getElementById('admin-product-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<div style="text-align:center;padding:var(--space-lg);"><div class="inline-spinner"></div> Loading...</div>';

    try {
      const data = await apiRequest('/products');
      const products = data.products || [];

      if (products.length === 0) {
        listContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:var(--space-xl);">No products yet. Add your first product above or <button class="btn btn-accent btn-sm" onclick="seedProducts()" style="margin-left:8px;">Seed Demo Data</button></p>';
        return;
      }

      listContainer.innerHTML = products.map((p) => `
        <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);border-bottom:1px solid var(--border);">
          <img src="${p.image}" alt="${p.name}" style="width:50px;height:50px;border-radius:var(--radius-sm);object-fit:cover;" onerror="this.src='https://via.placeholder.com/50x50?text=?'">
          <div style="flex:1;">
            <div style="font-weight:600;font-size:0.9rem;">${p.name}</div>
            <div style="color:var(--text-muted);font-size:0.8rem;">${p.category} · ${formatPrice(p.price)}</div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
        </div>
      `).join('');
    } catch (error) {
      listContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:var(--space-xl);">Could not load products. <button class="btn btn-accent btn-sm" onclick="seedProducts()" style="margin-left:8px;">Seed Demo Data</button></p>';
    }
  }

  window.seedProducts = async function () {
    showSpinner();
    try {
      await apiRequest('/products/seed', { method: 'POST' });
      hideSpinner();
      showToast('Demo products seeded!', 'success');
      loadProductList();
    } catch (error) {
      hideSpinner();
      showToast('Failed to seed: ' + error.message, 'error');
    }
  };

  window.deleteProduct = async function (id) {
    if (!confirm('Delete this product?')) return;
    showSpinner();
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      hideSpinner();
      showToast('Product deleted', 'success');
      loadProductList();
    } catch (error) {
      hideSpinner();
      showToast('Failed to delete: ' + error.message, 'error');
    }
  };
})();
