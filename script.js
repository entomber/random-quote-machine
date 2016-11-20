(function(global) {
  'use strict';

  const numQuotes = 20; // saves this # of quotes from quotes API
  var quoteAPI = `http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=${numQuotes}&_jsonp=getInitialQuote`;
  var twitterAPI = 'https://twitter.com/intent/tweet?text=';
  var data = null;
  var quoteIndex = null;
  var quote = '';
  var author = '';
  var elGetQuoteButton;
  var elQuoteHolder;
  var elQuote;
  var elAuthor;
  var elTwitterShareButton;

  document.addEventListener('DOMContentLoaded', function init() {
    elGetQuoteButton = document.getElementById('get-quote-button');
    elQuote = document.getElementById('quote');
    elAuthor = document.getElementById('author');
    elTwitterShareButton = document.getElementById('twitter-share-button');

    handleGetQuote();

    elGetQuoteButton.addEventListener('click', handleGetQuote, false);
    elTwitterShareButton.addEventListener('click', handleTwitterShare, false);
  }, false);

  /* Call quote API to get a random quote if there are no quotes.
   * Otherwise, get the next stored quote.
   */
  function handleGetQuote() {
    // call quote API to get a random quote for first time or if all quotes were displayed
    if (quoteIndex === null || quoteIndex > numQuotes - 1) {
      quoteIndex = 0;
      var script = document.createElement('script');
      // append time to force browser not to cache response
      script.src = `${quoteAPI}&callback=getInitialQuote?nocache=${new Date().getTime()}`;
      document.head.appendChild(script);
      document.head.removeChild(script); // remove so we don't keep creating script elements
      elGetQuoteButton.blur(); // removes focus on button after click
    } else { // get next stored quote
      getNextQuote();
    }
    quoteIndex++;
  }

  function handleTwitterShare(event) {
    event.preventDefault();
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes, \
      scrollbars=yes,height=400,width=600');
  }

  /* JSONP callback function. Updates quote and author variables and 
   * calls displayQuote function 
   */
  var getInitialQuote = global.getInitialQuote = function getInitialQuote(response) {
    console.log(response);

    data = response;
    /* save the quote and author from response, credit Tim Down @
    http://stackoverflow.com/questions/5002111/javascript-how-to-strip-html-tags-from-string
    */
    quote = response[0].content;
    author = response[0].title;
    // strip HTML tags from quote
    var parsedQuote = document.createElement('div');
    parsedQuote.innerHTML = quote;
    quote = parsedQuote.textContent || parsedQuote.innerText || '';
    quote = quote.trim(); // remove extra white space
    displayQuote();
    updateTwitter();
    console.log(`Quote: ${quote}`+'\n'+`Author: ${author}`);
  }

  /* Get next stored quote.
   */
  function getNextQuote() {
    quote = data[quoteIndex].content;
    var parsedQuote = document.createElement('div');
    parsedQuote.innerHTML = quote;
    quote = parsedQuote.textContent || parsedQuote.innerText || '';
    quote = quote.trim();
    author = data[quoteIndex].title;
    displayQuote();
    updateTwitter();
  }

  /* Displays the quote and author on page 
   * credit @icktoofay http://stackoverflow.com/questions/13327521/
   * animation for automatic height change 
   */
  function displayQuote() {
    elQuoteHolder = document.getElementById('quote-holder');
    var oldHeight;
    var newHeight;

    elGetQuoteButton.removeEventListener('click', handleGetQuote, false);
    elGetQuoteButton.style.cursor = 'default';
    elQuote.classList.add('fadeOut');
    elAuthor.classList.add('fadeOut');

    oldHeight = window.getComputedStyle(elQuoteHolder).height;

    // update page with new quote and author
    setTimeout(function showNewQuote() {
      elQuote.innerHTML = quote;
      if (author !== '') {
        elAuthor.innerHTML = (`- <i>${author}</i>`);
      } else {
        elAuthor.innerHTML = ('');
      }

      newHeight = window.getComputedStyle(elQuoteHolder).height;
      elQuoteHolder.style.height = oldHeight;
    }, 500);

    setTimeout(function () {
      elQuote.classList.remove('fadeOut');
      elAuthor.classList.remove('fadeOut');
      elGetQuoteButton.addEventListener('click', handleGetQuote, false);
      elQuoteHolder.style.height = newHeight;
      elGetQuoteButton.style.cursor = 'pointer';
    }, 500);

    elQuoteHolder.style.height = 'auto';
  }

  /* Updates the twitter button link on page */
  function updateTwitter() {
    var twitterShareButton = document.getElementById('twitter-share-button');
    var URL = ``;
    if (author) {
      URL = `${twitterAPI}"${encodeURIComponent(quote)}" -${encodeURIComponent(author)}`;
    }
    else {
      URL = `${twitterAPI}"${encodeURIComponent(quote)}"`;
    }
    twitterShareButton.setAttribute('href', URL);
  }
}(window));
