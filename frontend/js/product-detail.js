// ============================================
// ShopVerse — Product Detail Logic
// ============================================

(function () {
  'use strict';

  const detailContainer = document.getElementById('product-detail-container');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    detailContainer.innerHTML = '<div class="empty-cart"><div class="empty-icon">❌</div><h2>Product not found</h2><p>The product you\'re looking for doesn\'t exist.</p><a href="products.html" class="btn btn-primary" style="margin-top:1rem;">Browse Products</a></div>';
    return;
  }

  // Demo products fallback
  const demoProducts = {
    'demo-1': { id: 'demo-1', name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Features Bluetooth 5.2 and multipoint connection. The advanced ANC technology uses multiple microphones to detect and cancel ambient noise, letting you focus on your music or calls.', price: 4999, originalPrice: 7999, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'], rating: 4.5, reviews: 234, stock: 50, brand: 'SoundMax', tags: ['headphones', 'wireless', 'noise-cancelling'] },
    'demo-2': { id: 'demo-2', name: 'Smart Fitness Watch Pro', description: 'Advanced fitness tracker with AMOLED display, heart rate monitoring, GPS tracking, and 14-day battery life. Water resistant up to 50m. Track over 100 workout modes and monitor your sleep quality with precision sensors.', price: 3499, originalPrice: 5999, category: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'], rating: 4.3, reviews: 189, stock: 75, brand: 'TechFit', tags: ['watch', 'fitness'] },
    'demo-3': { id: 'demo-3', name: 'Ultra-Slim Laptop Stand', description: 'Ergonomic aluminum laptop stand with adjustable height settings. Compatible with all laptops up to 17 inches. Foldable and portable design perfect for remote work and travel.', price: 1299, originalPrice: 1999, category: 'electronics', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'], rating: 4.7, reviews: 412, stock: 120, brand: 'ErgoDesk', tags: ['laptop', 'stand'] },
    'demo-4': { id: 'demo-4', name: 'Premium Cotton Casual Shirt', description: 'Soft-touch 100% organic cotton shirt with a modern slim fit. Available in multiple colors. Perfect for casual and semi-formal occasions. Machine washable and wrinkle-resistant fabric.', price: 1499, originalPrice: 2499, category: 'fashion', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'], rating: 4.2, reviews: 156, stock: 200, brand: 'UrbanStyle', tags: ['shirt', 'cotton'] },
    'demo-5': { id: 'demo-5', name: 'Classic Leather Messenger Bag', description: 'Handcrafted genuine leather messenger bag with padded laptop compartment. Features brass hardware and adjustable shoulder strap. Perfect for professionals on the go.', price: 2999, originalPrice: 4999, category: 'fashion', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'], rating: 4.6, reviews: 98, stock: 35, brand: 'LeatherCraft', tags: ['bag', 'leather'] },
    'demo-6': { id: 'demo-6', name: 'Designer Sunglasses UV400', description: 'Polarized UV400 protection sunglasses with titanium frame. Ultra-lightweight at just 20g. Includes premium carrying case and cleaning cloth.', price: 1999, originalPrice: 3499, category: 'fashion', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'], rating: 4.4, reviews: 267, stock: 80, brand: 'VisionElite', tags: ['sunglasses'] },
    'demo-7': { id: 'demo-7', name: 'The Art of Clean Code', description: 'A comprehensive guide to writing maintainable, efficient, and elegant code. Covers best practices, design patterns, refactoring techniques, and test-driven development.', price: 599, originalPrice: 999, category: 'books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'], rating: 4.8, reviews: 523, stock: 300, brand: 'TechPress', tags: ['programming'] },
    'demo-8': { id: 'demo-8', name: 'Mindful Leadership', description: 'Discover the power of mindful leadership in the modern workplace. Packed with real-world case studies and actionable strategies for building high-trust teams.', price: 449, originalPrice: 799, category: 'books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'], rating: 4.1, reviews: 178, stock: 150, brand: 'MindPress', tags: ['leadership'] },
    'demo-9': { id: 'demo-9', name: 'Portable Bluetooth Speaker', description: 'Waterproof portable speaker with 360° surround sound. 20-hour playtime, built-in microphone, and TWS pairing capability. IPX7 rated for water resistance.', price: 2499, originalPrice: 3999, category: 'electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'], rating: 4.3, reviews: 345, stock: 90, brand: 'SoundMax', tags: ['speaker', 'bluetooth'] },
    'demo-10': { id: 'demo-10', name: 'Running Shoes - UltraBoost', description: 'Responsive cushioning running shoes with breathable knit upper. Energy-returning midsole and Continental rubber outsole for superior grip.', price: 3999, originalPrice: 6999, category: 'fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'], rating: 4.6, reviews: 892, stock: 60, brand: 'StridePro', tags: ['shoes', 'running'] },
    'demo-11': { id: 'demo-11', name: 'Digital Drawing Tablet', description: '10-inch drawing tablet with 8192 levels of pressure sensitivity. Battery-free stylus and customizable shortcut keys for creative professionals.', price: 5999, originalPrice: 8999, category: 'electronics', image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600', images: ['https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600'], rating: 4.4, reviews: 156, stock: 40, brand: 'ArtTech', tags: ['tablet', 'drawing'] },
    'demo-12': { id: 'demo-12', name: 'Data Science Handbook', description: 'Complete guide to data science covering Python, machine learning, statistics, and data visualization with hands-on projects.', price: 799, originalPrice: 1299, category: 'books', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'], rating: 4.6, reviews: 412, stock: 200, brand: 'TechPress', tags: ['data-science'] },
  };

  let product = null;
  let currentImageIndex = 0;

  async function loadProduct() {
    showSpinner();
    try {
      product = await apiRequest(`/products/${productId}`);
    } catch (error) {
      product = demoProducts[productId] || null;
    }
    hideSpinner();

    if (!product) {
      detailContainer.innerHTML = '<div class="empty-cart"><div class="empty-icon">❌</div><h2>Product not found</h2><a href="products.html" class="btn btn-primary" style="margin-top:1rem;">Browse Products</a></div>';
      return;
    }

    renderProduct();
  }

  function renderProduct() {
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const images = product.images || [product.image];
    const wishlist = JSON.parse(localStorage.getItem('shopverse_wishlist') || '[]');
    const isWishlisted = wishlist.includes(product.id);

    detailContainer.innerHTML = `
      <div class="product-detail-layout">
        <div class="product-gallery">
          <div class="main-image">
            <img id="main-product-image" src="${images[0]}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/600x600?text=ShopVerse'">
          </div>
          ${images.length > 1 ? `
            <div class="thumbnail-grid">
              ${images.map((img, i) => `
                <div class="thumbnail ${i === 0 ? 'active' : ''}" onclick="changeImage(${i}, '${img}')">
                  <img src="${img}" alt="Thumbnail ${i + 1}" onerror="this.src='https://via.placeholder.com/100x100?text=${i + 1}'">
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="product-detail-info">
          <div class="product-category">${product.category} · ${product.brand || 'ShopVerse'}</div>
          <h1>${product.name}</h1>

          <div class="product-detail-rating">
            <span class="stars">${generateStars(product.rating)}</span>
            <span class="rating-text">${product.rating} · ${product.reviews || 0} reviews</span>
          </div>

          <div class="product-detail-price">
            <span class="current">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
            ${discount > 0 ? `<span class="discount">${discount}% off</span>` : ''}
          </div>

          <p class="product-description">${product.description}</p>

          <div class="product-meta">
            <div class="product-meta-item">
              <span class="label">Availability</span>
              <span class="value" style="color: ${product.stock > 0 ? 'var(--accent)' : 'var(--warm)'}">
                ${product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>
            <div class="product-meta-item">
              <span class="label">Brand</span>
              <span class="value">${product.brand || 'ShopVerse'}</span>
            </div>
            <div class="product-meta-item">
              <span class="label">Category</span>
              <span class="value" style="text-transform:capitalize">${product.category}</span>
            </div>
            ${product.tags ? `
              <div class="product-meta-item">
                <span class="label">Tags</span>
                <span class="value">${product.tags.map(t => `<span style="background:var(--bg-tertiary);padding:2px 8px;border-radius:var(--radius-full);font-size:0.8rem;margin-left:4px;">${t}</span>`).join('')}</span>
              </div>
            ` : ''}
          </div>

          <div class="quantity-selector">
            <label>Quantity:</label>
            <div class="quantity-controls">
              <button onclick="changeQuantity(-1)">−</button>
              <input type="number" id="product-quantity" value="1" min="1" max="${product.stock}" readonly>
              <button onclick="changeQuantity(1)">+</button>
            </div>
          </div>

          <div class="detail-actions">
            <button class="btn btn-primary btn-lg" onclick="addToCartDetail()" ${product.stock <= 0 ? 'disabled style="opacity:0.5"' : ''}>
              🛒 Add to Cart
            </button>
            <button class="btn ${isWishlisted ? 'btn-danger' : 'btn-outline'} btn-lg" onclick="toggleDetailWishlist()">
              ${isWishlisted ? '❤ Wishlisted' : '♡ Wishlist'}
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="section" style="margin-top:var(--space-2xl);">
        <div class="section-header" style="text-align:left;">
          <h2>Customer Reviews</h2>
          <div class="accent-line" style="margin:var(--space-md) 0 0;"></div>
        </div>
        <div id="reviews-section" style="margin-top:var(--space-xl);">
          ${generateDemoReviews()}
        </div>
      </div>
    `;

    // Update page title
    document.title = `${product.name} | ShopVerse`;
  }

  function generateDemoReviews() {
    const reviews = [
      { name: 'Rahul S.', rating: 5, date: '2 weeks ago', text: 'Absolutely love this product! The quality is outstanding and it exceeded my expectations. Fast delivery too.' },
      { name: 'Priya M.', rating: 4, date: '1 month ago', text: 'Great product for the price. Minor packaging issue but the product itself is fantastic. Would recommend.' },
      { name: 'Amit K.', rating: 5, date: '2 months ago', text: 'Best purchase I\'ve made this year. Premium quality and works exactly as described. Five stars!' },
    ];

    return reviews.map(r => `
      <div class="order-card" style="margin-bottom:var(--space-md);">
        <div class="order-header">
          <div>
            <span class="order-id" style="font-size:1rem;">${r.name}</span>
            <span style="color:var(--warm-light);margin-left:var(--space-sm);">${generateStars(r.rating)}</span>
          </div>
          <span style="color:var(--text-muted);font-size:0.85rem;">${r.date}</span>
        </div>
        <p style="color:var(--text-secondary);line-height:1.7;">${r.text}</p>
      </div>
    `).join('');
  }

  // ── Image Gallery ──
  window.changeImage = function (index, src) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) {
      mainImg.src = src;
      currentImageIndex = index;
      document.querySelectorAll('.thumbnail').forEach((t, i) => {
        t.classList.toggle('active', i === index);
      });
    }
  };

  // ── Quantity ──
  window.changeQuantity = function (delta) {
    const input = document.getElementById('product-quantity');
    if (!input) return;
    let val = parseInt(input.value) + delta;
    val = Math.max(1, Math.min(val, product?.stock || 99));
    input.value = val;
  };

  // ── Add to Cart ──
  window.addToCartDetail = function () {
    if (!product) return;
    const quantity = parseInt(document.getElementById('product-quantity')?.value) || 1;

    const cart = JSON.parse(localStorage.getItem('shopverse_cart') || '[]');
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    localStorage.setItem('shopverse_cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${product.name} added to cart (×${quantity})`, 'success');
  };

  // ── Wishlist ──
  window.toggleDetailWishlist = function () {
    if (!product) return;
    let wishlist = JSON.parse(localStorage.getItem('shopverse_wishlist') || '[]');

    if (wishlist.includes(product.id)) {
      wishlist = wishlist.filter((id) => id !== product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      wishlist.push(product.id);
      showToast('Added to wishlist', 'success');
    }

    localStorage.setItem('shopverse_wishlist', JSON.stringify(wishlist));
    renderProduct(); // Re-render to update button state
  };

  loadProduct();
})();
