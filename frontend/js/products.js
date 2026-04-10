// ============================================
// ShopVerse — Products Listing Logic
// ============================================

(function () {
  'use strict';

  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const categoryFilters = document.querySelectorAll('input[name="category"]');
  const ratingFilters = document.querySelectorAll('input[name="rating"]');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const priceApplyBtn = document.getElementById('apply-price');
  const sortSelect = document.getElementById('sort-select');
  const resultsCount = document.getElementById('results-count');

  if (!productsGrid) return;

  let allProducts = [];
  let filteredProducts = [];
  let currentFilters = {
    category: 'all',
    minPrice: 0,
    maxPrice: Infinity,
    rating: 0,
    search: '',
    sort: 'default',
  };

  // Check URL params for category filter
  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  const urlSearch = urlParams.get('search');

  if (urlCategory) {
    currentFilters.category = urlCategory;
    const radio = document.querySelector(`input[name="category"][value="${urlCategory}"]`);
    if (radio) radio.checked = true;
  }

  if (urlSearch) {
    currentFilters.search = urlSearch;
    if (searchInput) searchInput.value = urlSearch;
  }

  // ── Fetch Products ──
  async function fetchProducts() {
    showSkeletons();
    try {
      const data = await apiRequest('/products');
      allProducts = data.products || [];
      applyFilters();
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Use demo data if API fails
      allProducts = getDemoProducts();
      applyFilters();
    }
  }

  // ── Demo Products (fallback) ──
  function getDemoProducts() {
    return [
      { id: 'demo-1', name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with ANC, 30hr battery', price: 4999, originalPrice: 7999, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', rating: 4.5, reviews: 234, stock: 50, brand: 'SoundMax' },
      { id: 'demo-2', name: 'Smart Fitness Watch Pro', description: 'AMOLED display, heart rate, GPS, 14-day battery', price: 3499, originalPrice: 5999, category: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', rating: 4.3, reviews: 189, stock: 75, brand: 'TechFit' },
      { id: 'demo-3', name: 'Ultra-Slim Laptop Stand', description: 'Ergonomic aluminum, adjustable, foldable', price: 1299, originalPrice: 1999, category: 'electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', rating: 4.7, reviews: 412, stock: 120, brand: 'ErgoDesk' },
      { id: 'demo-4', name: 'Premium Cotton Casual Shirt', description: '100% organic cotton, modern slim fit', price: 1499, originalPrice: 2499, category: 'fashion', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', rating: 4.2, reviews: 156, stock: 200, brand: 'UrbanStyle' },
      { id: 'demo-5', name: 'Classic Leather Messenger Bag', description: 'Handcrafted genuine leather, padded laptop compartment', price: 2999, originalPrice: 4999, category: 'fashion', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', rating: 4.6, reviews: 98, stock: 35, brand: 'LeatherCraft' },
      { id: 'demo-6', name: 'Designer Sunglasses UV400', description: 'Polarized UV400, titanium frame, ultra-lightweight', price: 1999, originalPrice: 3499, category: 'fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', rating: 4.4, reviews: 267, stock: 80, brand: 'VisionElite' },
      { id: 'demo-7', name: 'The Art of Clean Code', description: 'Writing maintainable, efficient, and elegant code', price: 599, originalPrice: 999, category: 'books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', rating: 4.8, reviews: 523, stock: 300, brand: 'TechPress' },
      { id: 'demo-8', name: 'Mindful Leadership', description: 'Power of mindful leadership in modern workplace', price: 449, originalPrice: 799, category: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500', rating: 4.1, reviews: 178, stock: 150, brand: 'MindPress' },
      { id: 'demo-9', name: 'Portable Bluetooth Speaker', description: 'Waterproof, 360° sound, 20hr playtime', price: 2499, originalPrice: 3999, category: 'electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', rating: 4.3, reviews: 345, stock: 90, brand: 'SoundMax' },
      { id: 'demo-10', name: 'Running Shoes - UltraBoost', description: 'Responsive cushioning, breathable knit upper', price: 3999, originalPrice: 6999, category: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', rating: 4.6, reviews: 892, stock: 60, brand: 'StridePro' },
      { id: 'demo-11', name: 'Digital Drawing Tablet', description: '10-inch, 8192 pressure levels, battery-free stylus', price: 5999, originalPrice: 8999, category: 'electronics', image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500', rating: 4.4, reviews: 156, stock: 40, brand: 'ArtTech' },
      { id: 'demo-12', name: 'Data Science Handbook', description: 'Python, ML, statistics, data visualization', price: 799, originalPrice: 1299, category: 'books', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', rating: 4.6, reviews: 412, stock: 200, brand: 'TechPress' },
    ];
  }

  // ── Apply Filters ──
  function applyFilters() {
    filteredProducts = allProducts.filter((p) => {
      if (currentFilters.category !== 'all' && p.category !== currentFilters.category) return false;
      if (p.price < currentFilters.minPrice) return false;
      if (p.price > currentFilters.maxPrice) return false;
      if (p.rating < currentFilters.rating) return false;
      if (currentFilters.search) {
        const search = currentFilters.search.toLowerCase();
        if (!p.name.toLowerCase().includes(search) && !p.description?.toLowerCase().includes(search)) return false;
      }
      return true;
    });

    // Sort
    switch (currentFilters.sort) {
      case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
      case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
      case 'rating': filteredProducts.sort((a, b) => b.rating - a.rating); break;
      case 'name': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    renderProducts();
  }

  // ── Render Products ──
  function renderProducts() {
    if (resultsCount) {
      resultsCount.textContent = `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`;
    }

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-cart" style="grid-column: 1/-1;">
          <div class="empty-icon">🔍</div>
          <h2>No products found</h2>
          <p>Try adjusting your filters or search terms</p>
        </div>
      `;
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem('shopverse_wishlist') || '[]');

    productsGrid.innerHTML = filteredProducts.map((product) => {
      const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
      const isWishlisted = wishlist.includes(product.id);
      
      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=ShopVerse'">
            ${discount > 0 ? `<span class="product-badge sale">${discount}% OFF</span>` : ''}
            <button class="product-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="Add to Wishlist">
              ${isWishlisted ? '❤' : '♡'}
            </button>
          </div>
          <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
              <span class="stars">${generateStars(product.rating)}</span>
              <span class="count">(${product.reviews || 0})</span>
            </div>
            <div class="product-price">
              <span class="current">${formatPrice(product.price)}</span>
              ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
              ${discount > 0 ? `<span class="discount">${discount}% off</span>` : ''}
            </div>
            <div class="product-actions">
              <a href="product-detail.html?id=${product.id}" class="btn btn-outline btn-sm">View Details</a>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCartQuick('${product.id}')">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ── Skeleton Loading ──
  function showSkeletons() {
    productsGrid.innerHTML = Array(8).fill('').map(() => `
      <div class="product-card">
        <div class="product-image skeleton" style="aspect-ratio:1;"></div>
        <div class="product-info">
          <div class="skeleton" style="height:12px;width:60px;margin-bottom:8px;"></div>
          <div class="skeleton" style="height:18px;width:100%;margin-bottom:8px;"></div>
          <div class="skeleton" style="height:14px;width:80px;margin-bottom:8px;"></div>
          <div class="skeleton" style="height:20px;width:100px;margin-bottom:12px;"></div>
          <div class="skeleton" style="height:36px;width:100%;"></div>
        </div>
      </div>
    `).join('');
  }

  // ── Quick Add to Cart ──
  window.addToCartQuick = function (productId) {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('shopverse_cart') || '[]');
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem('shopverse_cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${product.name} added to cart`, 'success');
  };

  // ── Wishlist Toggle ──
  window.toggleWishlist = function (productId) {
    let wishlist = JSON.parse(localStorage.getItem('shopverse_wishlist') || '[]');

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
      showToast('Removed from wishlist', 'info');
    } else {
      wishlist.push(productId);
      showToast('Added to wishlist', 'success');
    }

    localStorage.setItem('shopverse_wishlist', JSON.stringify(wishlist));

    // Also sync with API if logged in
    const user = firebase.auth().currentUser;
    if (user) {
      apiRequest('/auth/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      }).catch(() => {}); // Silent fail
    }

    renderProducts();
  };

  // ── Event Listeners ──
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        currentFilters.search = e.target.value;
        applyFilters();
      }, 300);
    });
  }

  categoryFilters.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
      applyFilters();
    });
  });

  ratingFilters.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      currentFilters.rating = parseFloat(e.target.value);
      applyFilters();
    });
  });

  if (priceApplyBtn) {
    priceApplyBtn.addEventListener('click', () => {
      currentFilters.minPrice = parseFloat(minPriceInput?.value) || 0;
      currentFilters.maxPrice = parseFloat(maxPriceInput?.value) || Infinity;
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sort = e.target.value;
      applyFilters();
    });
  }

  // ── Initialize ──
  fetchProducts();

})();
