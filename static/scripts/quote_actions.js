document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        try {
            await generateQuote();
        } catch(err) {
            showFlashMessage('Unable to load quote! Pls, Refresh page.', true);
        }
    })();

    const getNewQuote = document.getElementById('get-quote');
    getNewQuote.addEventListener('click', async () => {
        try {
            await generateQuote();
        } catch(err) {
            showFlashMessage(err.message, true);
        }
    });

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
        // const response = await fetch('http://localhost:5000/quote');
            
        let response = [
            {
                quote: 'The mountain you see today you shall see no more',
                author: '2AI',
            },
            {
                quote: 'Suffer a witch not to live',
                author: 'Anthony',
            },
            {
                quote: 'We only live once, but if we do it right, once is enough',
                author: 'Mai West',
            },
        ];

        const choice = Math.floor(Math.random() * 3);
        response = response[choice];

        const quote = document.getElementById('quote');
        const quoteAuthor = document.getElementById('quote-author');

        quote.classList.add('hidden', 'fade-out');
        quoteAuthor.classList.add('hidden', 'fade-out');
        setTimeout(() => {
            quote.innerText = response.quote;    
            quoteAuthor.innerText = response.author;
            quote.classList.remove('hidden');
            quoteAuthor.classList.remove('hidden');
        }, 1000);
    } catch(err) {
        throw Error('Unable to generate quote! Pls, try again.');
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
    //check if user logged in.
    // if yes, save else return the login page
    showFlashMessage('Quote has been saved!');
}

function getQuoteAndAuthor() {
    const quote = document.getElementById('quote').innerText;
    const quoteAuthor = document.getElementById('quote-author').innerText;
    
    return `"${quote}" -- ${quoteAuthor}`;
}

function showFlashMessage(message, isError=false) {
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