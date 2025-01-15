import { showFlashMessage } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const quotesContainer = document.getElementById('quotes-container');
  const myQuotes = quotesContainer.getElementsByClassName('my-quote');

  const queryParams = new URLSearchParams(window.location.search);

  const action = queryParams.get('action');
  const quoteId = queryParams.get('quoteId');

  const newUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, '', newUrl);

  if (action === 'save' && quoteId) {
    const saveQuote = async () => {
      try {
        const response = await fetch(`/quotes/${quoteId}`, { method: 'POST' });

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

          const totalNumberOfQuotes = document.getElementById('number-of-quotes');
          const currentCount = parseInt(totalNumberOfQuotes.innerText.match(/\d+/)[0], 10) || 0;
          totalNumberOfQuotes.innerText = `Total saved Quotes: ${currentCount + 1}`;

          const quotesContainer = document.getElementById('quotes-container');
          if (currentCount <= 0) quotesContainer.replaceChildren();
          quotesContainer.appendChild(newQuoteElement);

          return showFlashMessage('Saved succesfully');
        }
    
        if (response.status === 409) {
          return showFlashMessage('Quote has already been saved!');
        }
      } catch(err) {
        console.error('Error saving quote:', err);
        showFlashMessage('Save unsuccessful. Pls, try again.', true);
      }
    }

    saveQuote();
  }

  const logoutBtn = document.getElementById('logout');
  logoutBtn.addEventListener('click', async () => {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/login';
  });

  const dropDownUp = document.getElementsByClassName('drop-down-up')[0];
  dropDownUp.addEventListener('click', () => {
      const saved = document.getElementById('saved');
      const body = document.body;
      const dashboardContainer = document.getElementById('dashboard-container');

    if (!saved.style.top || saved.style.top === '-100%') {
      dashboardContainer.style.overflowY = 'scroll';
      saved.style.top = 'calc(70px + 60px)';
      body.classList.add('no-scroll');
      dropDownUp.style.transform = 'rotate(180deg)';
    } else {
      saved.style.top = '-100%';
      dashboardContainer.style.overflowY = 'auto';
      body.classList.remove('no-scroll');
      dropDownUp.style.transform = 'rotate(0deg)';
    }
  });

  const searchInput = document.getElementById('search-input');

  const filterCategory = document.getElementById('filter');
  filterCategory.addEventListener('change', () => {
    if (filterCategory.value === 'date') {
      searchInput.type = 'date';
    } else if (filterCategory.value === 'quote') {
      searchInput.placeholder = 'Search by quote...';
      searchInput.type = 'text';
    } else if (filterCategory.value === 'author') {
      searchInput.placeholder = 'Search by author...';
      searchInput.type = 'text';
    }

    searchInput.value = '';

    for (let i = 0; i < myQuotes.length; i++) {
      myQuotes[i].style.display = 'block';
    }
  });

  document.getElementById('search-input').addEventListener('input', () => {
    if (['quote', 'author'].includes(filterCategory.value)) {
      const input = searchInput.value.toLowerCase();
      const filterby = filterCategory.value;

      for (let i = 0, count = 0; i < myQuotes.length; i++) {
        const text = myQuotes[i].querySelector(`.user-${filterby}`).textContent.toLowerCase();

        if (!text.includes(input)) {
          myQuotes[i].style.display = 'none';
          ++count;
        } else myQuotes[i].style.display = 'block';

        let noResultsMessage = document.getElementById('no-results');
        if (!noResultsMessage) {
          noResultsMessage = document.createElement('div');
          noResultsMessage.id = 'no-results';
          noResultsMessage.style.display = 'none';
          noResultsMessage.style.textAlign = 'center';
          noResultsMessage.style.color = 'red';
          noResultsMessage.style.fontWeight = 'bolder';
          noResultsMessage.textContent = 'No results found';
          quotesContainer.appendChild(noResultsMessage);
        }
        if (count === myQuotes.length) noResultsMessage.style.display = 'block';
        else  noResultsMessage.style.display = 'none';
      }
    } else if (filterCategory.value === 'date') {
      const inputDate = toDDMMYYYY(searchInput.value);
      for (let i = 0; i < myQuotes.length; i++) {
        const quoteDate = toDDMMYYYY(myQuotes[i].querySelector('.user-date').textContent);

        if (quoteDate !== inputDate) myQuotes[i].style.display = 'none';
        else myQuotes[i].style.display = 'block';
      }
    }
  });

  let selected;

  quotesContainer.addEventListener('click', (event) => {
    const myQuote = event.target.closest('.my-quote');

    if (myQuote) {
      selected = myQuote;

      const quote = myQuote.querySelector('.user-quote').textContent;
      const author = myQuote.querySelector('.user-author').textContent;

      document.getElementById('q').innerText = `"${quote}"`;
      document.getElementById('a').innerText = `-- ${author}`;

      showOverlay('.overlay#view-quote-overlay');
      document.getElementById('saved').style.overflow = 'hidden';
    }
  });
 
  const close = document.getElementById('close');
  close.addEventListener('click', () => {
    selected = null;
    document.getElementById('saved').style.overflowY = 'scroll';
    hideOverlay('.overlay#view-quote-overlay');
  });

  const savedCopy = document.getElementById('saved-copy');
  savedCopy.addEventListener('click', copySaved);

  const savedShare = document.getElementById('saved-share');
  savedShare.addEventListener('click', () => {
    const savedSharingPlatform = document.getElementsByClassName('saved-sharing-platform-container')[0];

    savedSharingPlatform.classList.remove('hidden');
    savedSharingPlatform.classList.add('visible');

    setTimeout(() => {
      savedSharingPlatform.classList.remove('visible');
      savedSharingPlatform.classList.add('hidden');       
    }, 4000);
  });

  const savedTwitterShare = document.getElementById('saved-twitter-share');
  savedTwitterShare.addEventListener('click', shareOnTwitter);

  const savedFacebookShare = document.getElementById('saved-facebook-share');
  savedFacebookShare.addEventListener('click', shareOnFacebook);

  const deleteQuote = document.getElementById('saved-delete');
  deleteQuote.addEventListener('click', () => showOverlay('.overlay#confirm-delete'));

  const no = document.getElementById('no');
  no.addEventListener('click', () => hideOverlay('.overlay#confirm-delete'));

  const yes = document.getElementById('yes');
  yes.addEventListener('click', async () => {
    const id = selected.getAttribute('data-id');

    try {
      let response = await fetch(`/quotes/${id}`, { method: 'DELETE' });

      if (response.status === 204) {
        selected.remove();

        const totalNumberOfQuotes = document.getElementById('number-of-quotes');
        const currentCount = parseInt(totalNumberOfQuotes.innerText.match(/\d+/)[0], 10) || 0;
        totalNumberOfQuotes.innerText = `Total saved Quotes: ${currentCount - 1}`;

        if (currentCount - 1 <= 0) {
          const quotesContainer = document.getElementById('quotes-container');
          quotesContainer.innerHTML = '<div class="no-quotes-message">\
                                             <p>No saved quotes</p>\
                                           </div>';
        }

        showFlashMessage('Deleted successfully');
      } else {
        showFlashMessage('Delete unsuccessful, try again later.', true);
      }
    } catch(err) {
      console.log('Error deleting quote:', err);
      showFlashMessage('Sorry, try again later.', true);
    }

    hideOverlay('.overlay#confirm-delete');
    hideOverlay('.overlay#view-quote-overlay');
  });
});

function copySaved() {
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

function hideOverlay(element) {
  document.querySelector(element).style.visibility = 'hidden';
}

function showOverlay(element) {
  document.querySelector(element).style.visibility = 'visible';
}

function getQuoteAndAuthor() {
  const q = document.getElementById('q').innerText;
  const a = document.getElementById('a').innerText;

  return `${q} ${a}`;
}

function toDDMMYYYY(format) {
  const date = new Date(format);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
