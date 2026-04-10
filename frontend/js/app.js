// ============================================
// ShopVerse — Core Application Logic
// ============================================

(function () {
  'use strict';

  // ── Navigation ──
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = mobileToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Toast Notification System ──
  window.showToast = function (message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="font-size:1.2rem;font-weight:700;">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // ── Loading Spinner ──
  window.showSpinner = function () {
    if (document.querySelector('.spinner-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'spinner-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
  };

  window.hideSpinner = function () {
    const overlay = document.querySelector('.spinner-overlay');
    if (overlay) overlay.remove();
  };

  // ── Cart Badge Update ──
  window.updateCartBadge = function () {
    const cart = JSON.parse(localStorage.getItem('shopverse_cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge-count').forEach((badge) => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
  };

  // ── Auth State Listener ──
  window.updateAuthUI = function () {
    const user = firebase.auth().currentUser;
    const loginBtn = document.getElementById('nav-login-btn');
    const profileBtn = document.getElementById('nav-profile-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (profileBtn) profileBtn.style.display = 'flex';
      if (logoutBtn) logoutBtn.style.display = 'flex';
    } else {
      if (loginBtn) loginBtn.style.display = 'flex';
      if (profileBtn) profileBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  };

  // Listen for auth state changes
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(() => {
      window.updateAuthUI();
    });
  }

  // ── Logout ──
  window.handleLogout = function () {
    firebase.auth().signOut().then(() => {
      showToast('Logged out successfully', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    }).catch((error) => {
      showToast('Error logging out', 'error');
    });
  };

  // ── Helper: Format Price ──
  window.formatPrice = function (price) {
    return '₹' + price.toLocaleString('en-IN');
  };

  // ── Helper: Generate Star Rating ──
  window.generateStars = function (rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '★';
    if (half) stars += '★';
    for (let i = stars.length; i < 5; i++) stars += '☆';
    return stars;
  };

  // ── Helper: API Request ──
  window.apiRequest = async function (endpoint, options = {}) {
    const url = `${ShopVerse.API_BASE_URL}${endpoint}`;
    const user = firebase.auth().currentUser;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  };

  // Update cart badge on load
  updateCartBadge();

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
