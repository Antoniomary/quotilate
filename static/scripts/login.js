document.addEventListener('DOMContentLoaded', () => {
    const passShowHide = document.getElementById('pass-show-hide');
    passShowHide.addEventListener('click', () => changeType('pass'));

    const loginForm = document.getElementById('login-form');
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
            
            if (res.ok) {
                window.location.href = '/dashboard';
            } else {
                alert('sorry');
            }
        } catch (err) {
            // console.log(err.message);
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
