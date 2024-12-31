document.addEventListener('DOMContentLoaded', () => {
    const passShowHide = document.getElementById('pass-show-hide');
    passShowHide.addEventListener('click', () => changeType('pass'));

    const rePassShowHide = document.getElementById('re-pass-show-hide');
    rePassShowHide.addEventListener('click', () => changeType('re-pass'));

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
                alert('i was here');
                const result = await res.json();
                return showFlashMessage(result.error, true);
            }

            window.location.href = '/dashboard';
        } catch(err) {
            showFlashMessage('Sorry, try again later.', true);
        }
    });
});

function changeType(loginInput) {
    const inputField = document.getElementById(loginInput).querySelector('input');
    const passShowHide = document.getElementById(loginInput).querySelector('div');

    if (inputField.type === 'text') {
        inputField.type = 'password';
        passShowHide.style.backgroundImage = "url('../images/bx-hide.svg')";
    } else {
        inputField.type = 'text';
        passShowHide.style.backgroundImage = "url('../images/bx-show.svg')";
    }

    inputField.focus();
}
