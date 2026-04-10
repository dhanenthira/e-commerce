// ============================================
// ShopVerse — Authentication Logic
// ============================================

(function () {
  'use strict';

  // ── Signup ──
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm').value;

      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }

      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }

      showSpinner();
      try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });

        // Register in Firestore via API
        try {
          await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ displayName: name, email }),
          });
        } catch (apiError) {
          console.warn('API registration skipped:', apiError.message);
          // Still allow signup if API is down — data is in Firebase Auth
        }

        hideSpinner();
        showToast('Account created successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (error) {
        hideSpinner();
        let message = 'Signup failed';
        if (error.code === 'auth/email-already-in-use') message = 'Email is already registered';
        if (error.code === 'auth/weak-password') message = 'Password is too weak';
        if (error.code === 'auth/invalid-email') message = 'Invalid email address';
        showToast(message, 'error');
      }
    });
  }

  // ── Login ──
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      showSpinner();
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        hideSpinner();
        showToast('Welcome back!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (error) {
        hideSpinner();
        let message = 'Login failed';
        if (error.code === 'auth/user-not-found') message = 'No account found with this email';
        if (error.code === 'auth/wrong-password') message = 'Incorrect password';
        if (error.code === 'auth/invalid-email') message = 'Invalid email address';
        if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Try again later';
        showToast(message, 'error');
      }
    });
  }

  // ── Google Sign-In ──
  const googleBtn = document.getElementById('google-signin');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      showSpinner();
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);

        // Register in Firestore if new user
        if (result.additionalUserInfo?.isNewUser) {
          try {
            await apiRequest('/auth/register', {
              method: 'POST',
              body: JSON.stringify({
                displayName: result.user.displayName,
                email: result.user.email,
              }),
            });
          } catch (apiError) {
            console.warn('API registration skipped:', apiError.message);
          }
        }

        hideSpinner();
        showToast('Signed in with Google!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (error) {
        hideSpinner();
        if (error.code !== 'auth/popup-closed-by-user') {
          showToast('Google sign-in failed', 'error');
        }
      }
    });
  }
})();
