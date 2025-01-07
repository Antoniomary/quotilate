import { showFlashMessage } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const getNewQuote = document.getElementById('get-quote');
  getNewQuote.addEventListener('click', async () => await generateQuote());

  const copyBtn = document.getElementById('copy');
  copyBtn.addEventListener('click', copyText);

  const shareBtn = document.getElementById('share');
  shareBtn.addEventListener('click', () => {
    const sharingPlatform = document.getElementsByClassName('sharing-platform-container')[0];

    sharingPlatform.classList.remove('hidden');
    sharingPlatform.classList.add('visible');

    setTimeout(() => {
      sharingPlatform.classList.remove('visible');
      sharingPlatform.classList.add('hidden');       
    }, 12000);
  });

  const twitterShare = document.getElementById('twitter-share');
  twitterShare.addEventListener('click', shareOnTwitter);

  const facebookShare = document.getElementById('facebook-share');
  facebookShare.addEventListener('click', shareOnFacebook);

  const saveBtn = document.getElementById('save');
  saveBtn.addEventListener('click', saveQuote);
});

async function generateQuote() {
  try {
    let response = await fetch('/quote');

    if (!response.ok) return showFlashMessage('Sorry, try again later.', true);

    response = await response.json();

    const quote = document.getElementById('quote');
    const quoteAuthor = document.getElementById('quote-author');

    quote.classList.add('hidden', 'fade-out');
    quoteAuthor.classList.add('hidden', 'fade-out');
    setTimeout(() => {
      quote.innerText = response.quote;
      quote.dataset.id = response.id;
      quoteAuthor.innerText = response.author;
      quote.classList.remove('hidden');
      quoteAuthor.classList.remove('hidden');
    }, 1000);
  } catch(err) {
    showFlashMessage('Unable to generate quote! Pls, try again.', true);
  }
}

function copyText() {
  const text = getQuoteAndAuthor();

  navigator.clipboard.writeText(text)
    .then(() => {
      showFlashMessage('Quote copied to clipboard!');
    })
    .catch((err) => {
      showFlashMessage('Failed to copy quote', true);
    })
}

function shareOnTwitter() {
  const textToShare = getQuoteAndAuthor();
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;

  window.open(twitterUrl, '_blank');
}

function shareOnFacebook() {
  const textToShare = getQuoteAndAuthor();
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(textToShare)}`;

  window.open(facebookUrl, '_blank');
}

async function saveQuote() {
  try {
    const id = document.getElementById('quote').getAttribute('data-id');
    const response = await fetch(`/quotes/${id}`, { method: 'POST' });

    if (response.status === 201) {
      const data = await response.json();

      data.savedAt = new Date(data.savedAt).toGMTString();

      const newQuoteElement = document.createElement('div');
      newQuoteElement.className = 'my-quote';
      newQuoteElement.setAttribute('data-id', data.id);
      newQuoteElement.innerHTML = `
        <div class="my-quote-overlay">
          <div class="content"><h3>view</h3></div>
        </div>
        <p class="user-quote">${data.quote}</p>
        <p class="user-author">${data.author}</p>
        <p class="user-date">${data.savedAt}</p>
      `;

      const quotesContainer = document.getElementById('quotes-container');
      quotesContainer.appendChild(newQuoteElement);

      const totalNumberOfQuotes = document.getElementById('number-of-quotes');
      const currentCount = parseInt(totalNumberOfQuotes.innerText.match(/\d+/)[0], 10) || 0;
      totalNumberOfQuotes.innerText = `Total saved Quotes: ${currentCount + 1}`;

      return showFlashMessage('Saved succesfully');
    }
    
    if (response.status === 409) {
      return showFlashMessage('Quote has already been saved!');
    }

    if (response.status === 401) {
      showFlashMessage('You must be logged in to save quotes.', true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return;
    }

    return showFlashMessage('Sorry, try again later.', true);
  } catch(err) {
    console.error('Error saving quote:', err);
    showFlashMessage('Save unsuccessful. Pls, try again.', true);
  }
}

function getQuoteAndAuthor() {
  const quote = document.getElementById('quote').innerText;
  const quoteAuthor = document.getElementById('quote-author').innerText;
    
  return `"${quote}" -- ${quoteAuthor}`;
}