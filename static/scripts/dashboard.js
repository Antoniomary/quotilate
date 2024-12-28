document.addEventListener('DOMContentLoaded', () => {
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

    const filterCategory = document.getElementById('filter');
    filterCategory.addEventListener('change', () => {
        const searchInput = document.getElementById('search-input');
        if (filterCategory.value === 'date') {
            searchInput.type = 'date';
        } else if (filterCategory.value === 'quote') {
            searchInput.placeholder = 'Search by quote...';
            searchInput.type = 'text';
        } else if (filterCategory.value === 'author') {
            searchInput.placeholder = 'Search by author...';
            searchInput.type = 'text';
        }
    });

    const myQuotes = document.getElementsByClassName('my-quote');
    for (let i = 0; i < myQuotes.length; i++) {
        myQuotes[i].addEventListener('click', () => {
            const quote = myQuotes[i].querySelector('.user-quote').textContent;
            const author = myQuotes[i].querySelector('.user-author').textContent;
            document.getElementById('q').innerText = `"${quote}"`;
            document.getElementById('a').innerText = `-- ${author}`;
            showOverlay('.overlay#view-quote-overlay');
            document.getElementById('saved').style.overflow = 'hidden';
        });
    }
    
    const close = document.getElementById('close');
    close.addEventListener('click', () => {
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

    const saveFacebookShare = document.getElementById('saved-facebook-share');
    saveFacebookShare.addEventListener('click', shareOnFacebook);

    const deleteQuote = document.getElementById('saved-delete');
    deleteQuote.addEventListener('click', () => showOverlay('.overlay#confirm-delete'));

    const no = document.getElementById('no');
    no.addEventListener('click', () => hideOverlay('.overlay#confirm-delete'));

    // const yes = document.getElementById('yes');
    // yes.addEventListener('click', () => {
    //     hideOverlay('.overlay#confirm-delete');
    // });
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