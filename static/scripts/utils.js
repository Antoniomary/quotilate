export function changeType(loginInput) {
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

export function showFlashMessage(message, isError=false) {
  const flashMessage = document.getElementById('flash-message');

  flashMessage.innerText = message;
  flashMessage.style.backgroundColor = isError ? '#f44336' : '#4caf50';

  flashMessage.classList.remove('hidden');
  flashMessage.classList.add('visible');

  setTimeout(() => {
    flashMessage.classList.remove('visible');
    flashMessage.classList.add('hidden');
  }, 3000);
}
