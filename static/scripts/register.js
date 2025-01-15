import { changeType, showFlashMessage } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const passShowHide = document.getElementById('pass-show-hide');
  passShowHide.addEventListener('click', () => changeType('pass'));

  const rePassShowHide = document.getElementById('re-pass-show-hide');
  rePassShowHide.addEventListener('click', () => changeType('re-pass'));

  const queryParams = new URLSearchParams(window.location.search);
  const action = queryParams.get('action');
  const quoteId = queryParams.get('quoteId');

  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('user').querySelector('input').value;
    const email = document.getElementById('email').querySelector('input').value;
    const password = document.getElementById('pass').querySelector('input').value;
    const repassword = document.getElementById('re-pass').querySelector('input').value;

    try {
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

      if (!res.ok) {
        const result = await res.json();
        return showFlashMessage(result.error, true);
      }

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
