(function(global) {

  var quoteAPI = 'http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&jsonp=getQuote&lang=en';
  var twitterAPI = 'https://twitter.com/intent/tweet?text=';
  var quote = '';
  var author = '';
  var elGetQuoteButton;
  var elQuoteHolder;
  var elQuote;
  var elAuthor;
  var elTwitterShareButton;

  document.addEventListener('DOMContentLoaded', init, false);

  function init() {
    elGetQuoteButton = document.getElementById('get-quote-button');
    elQuote = document.getElementById('quote');
    elAuthor = document.getElementById('author');
    elTwitterShareButton = document.getElementById('twitter-share-button');

    handleGetQuote();

    elGetQuoteButton.addEventListener('click', handleGetQuote, false);
    elTwitterShareButton.addEventListener('click', handleTwitterShare, false);
  }

  function handleGetQuote() {
    // call quote API to get a random quote
    var script = document.createElement('script');
    script.src = `${quoteAPI}&callback=getQuote`;
    document.head.appendChild(script);
    document.head.removeChild(script); // remove so we don't keep creating script elements
    elGetQuoteButton.blur(); // removes focus on button after click
  }

  function handleTwitterShare(event) {
    event.preventDefault();
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes, \
      scrollbars=yes,height=400,width=600');
  }

  /* Called from callback of .getJSON function. Updates quote 
    and author variables and calls displayQuote function */
  var getQuote = global.getQuote = function getQuote (response) {
    console.log(response);

    // save the quote and author from response
    quote = response.quoteText.trim(); // remove extra whitespace from beginning/end
    author = response.quoteAuthor;
    displayQuote();
    updateTwitter();
    console.log(`Quote: ${quote}`+'\n'+`Author: ${author}`);
  }

  /* Displays the quote and author on page 
  credit @icktoofay http://stackoverflow.com/questions/13327521/
  animation for automatic height change */
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
