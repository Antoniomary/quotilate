import { changeType, showFlashMessage } from './utils.js';

/**
 * Event listener for the DOMContentLoaded event. Initializes event listeners for
 * password visibility toggle, form submission, and the signup link redirection.
 */
document.addEventListener('DOMContentLoaded', () => {
  const passShowHide = document.getElementById('pass-show-hide');

  /**
   * Toggles password visibility when the passShowHide button is clicked.
   */
  passShowHide.addEventListener('click', () => changeType('pass'));

  const queryParams = new URLSearchParams(window.location.search);
  const action = queryParams.get('action');
  const quoteId = queryParams.get('quoteId');

  const loginForm = document.getElementById('login-form');
  /**
   * Handles the login form submission, sends login credentials to the server,
   * and redirects the user based on the result.
   * 
   * @param {Event} e - The form submission event.
   */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identifier = document.getElementById('user').querySelector('input').value;
    const password = document.getElementById('pass').querySelector('input').value;

    try {
      const res = await fetch('/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: identifier,
            email: identifier,
            password,
          }),
        }
      );
            
      if (!res.ok) {
        const result = await res.json();
        return showFlashMessage(result.error, true);
      }

      const dashboardUrl = action && quoteId ?
        `/dashboard?action=${action}&quoteId=${encodeURIComponent(quoteId)}`:
        '/dashboard';

      window.location.href = dashboardUrl;
    } catch (err) {
      console.log('Error logging in:', err);
      showFlashMessage('Sorry, try again later', true);
    }
  });

  const signupLink = document.querySelector('.form-container a');
  /**
   * Redirects the user to the signup page, appending the action and quoteId 
   * parameters to the URL if present.
   * 
   * @param {Event} event - The click event on the signup link.
   */
  signupLink.addEventListener('click', (event) => {
    if (action === 'save' && quoteId) {
      event.preventDefault();

      const url = `/register?action=${action}&quoteId=${encodeURIComponent(quoteId)}`;
      window.location.href = url; 
    }
  });
});
