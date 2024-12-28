document.addEventListener('DOMContentLoaded', () => {
    const passShowHide = document.getElementById('pass-show-hide');
    passShowHide.addEventListener('click', () => changeType('pass'));

    const rePassShowHide = document.getElementById('re-pass-show-hide');
    rePassShowHide.addEventListener('click', () => changeType('re-pass'));
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
