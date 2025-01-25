import { changeType, showFlashMessage } from './utils.js';

/**
 * Initializes event listeners for password visibility toggle,
 * form submission, and handling the redirection based on query parameters.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Event listener for toggling password visibility
  const passShowHide = document.getElementById('pass-show-hide');
  passShowHide.addEventListener('click', () => changeType('pass'));

  // Event listener for toggling re-password visibility
  const rePassShowHide = document.getElementById('re-pass-show-hide');
  rePassShowHide.addEventListener('click', () => changeType('re-pass'));

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  const action = queryParams.get('action');
  const quoteId = queryParams.get('quoteId');

  // Register form event listener for submitting the registration form
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const username = document.getElementById('user').querySelector('input').value;
    const email = document.getElementById('email').querySelector('input').value;
    const password = document.getElementById('pass').querySelector('input').value;
    const repassword = document.getElementById('re-pass').querySelector('input').value;

    try {
      // Send the registration request to the server
      const res = await fetch('/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            repassword,
          }),
        }
      );

      // Handle error response
      if (!res.ok) {
        const result = await res.json();
        return showFlashMessage(result.error, true);
      }

      // Redirect to dashboard or custom action URL
      const dashboardUrl = action && quoteId ?
        `/dashboard?action=${action}&quoteId=${encodeURIComponent(quoteId)}`:
        '/dashboard';

      window.location.href = dashboardUrl;
    } catch(err) {
      console.log('Error registering:', err);
      showFlashMessage('Sorry, try again later.', true);
    }
  });
});
