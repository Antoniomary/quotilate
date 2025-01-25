/**
 * Toggles the visibility of a password input field and changes the associated
 * icon to show or hide the password.
 * 
 * @param {string} loginInput - The ID of the password input field container.
 */
export function changeType(loginInput) {
  const inputField = document.getElementById(loginInput).querySelector('input');
  const passShowHide = document.getElementById(loginInput).querySelector('div');

  // Toggle the input type between 'text' and 'password'
  if (inputField.type === 'text') {
    inputField.type = 'password';
    passShowHide.style.backgroundImage = "url('../images/bx-hide.svg')";
  } else {
    inputField.type = 'text';
    passShowHide.style.backgroundImage = "url('../images/bx-show.svg')";
  }

  // Focus the input field after toggling
  inputField.focus();
}

/**
 * Displays a flash message to the user. The message will disappear after a set time.
 * 
 * @param {string} message - The message to be displayed.
 * @param {boolean} [isError=false] - Indicates whether the message is an error. Defaults to false.
 */
export function showFlashMessage(message, isError=false) {
  const flashMessage = document.getElementById('flash-message');

  // Set the flash message text
  flashMessage.innerText = message;
  // Change background color based on error status
  flashMessage.style.backgroundColor = isError ? '#f44336' : '#4caf50';

  // Show the flash message
  flashMessage.classList.remove('hidden');
  flashMessage.classList.add('visible');

  // Hide the flash message after 3 seconds
  setTimeout(() => {
    flashMessage.classList.remove('visible');
    flashMessage.classList.add('hidden');
  }, 3000);
}
