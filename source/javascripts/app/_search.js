//= require ../lib/_lunr
//= require ../lib/_jquery.highlight
/*globals lunr,$*/
(function () {
  'use strict';

  var content, searchResults,
    highlightOpts = { element: 'span', className: 'search-highlight' },

    index = new lunr.Index();

  index.ref('id');
  index.field('title', { boost: 10 });
  index.field('body');
  index.pipeline.add(lunr.trimmer, lunr.stopWordFilter);

  function populate() {
    $('h1, h2').each(function () {
      var title = $(this),
        body = title.nextUntil('h1, h2');
      index.add({
        id: title.prop('id'),
        title: title.text(),
        body: body.text()
      });
    });
  }

  function unhighlight() {
    content.unhighlight(highlightOpts);
  }

  function highlight(value) {
    if (value) { content.highlight(value, highlightOpts); }
  }

  function search(event) {
    var input = event.currentTarget,
      results;
    
    unhighlight();
    searchResults.addClass('visible');

    // ESC clears the field
    if (event.keyCode === 27) { input.value = ''; }

    if (input.value) {
      results = index.search(input.value).filter(function (r) {
        return r.score > 0.0001;
      });

      if (results.length) {
        searchResults.empty();
        $.each(results, function (index, result) {
          var elem = document.getElementById(result.ref);
          searchResults.append("<li><a href='#" + result.ref + "'>" + $(elem).text() + "</a></li>");
        });
        highlight.call(input.value);
      } else {
        searchResults.html('<li></li>');
        $('.search-results li').text('No Results Found for "' + input.value + '"');
      }
    } else {
      unhighlight();
      searchResults.removeClass('visible');
    }
  }

  function bind() {
    content = $('.content');
    searchResults = $('.search-results');

    $('#input-search').on('keyup', function (e) { search(e); });
  }

  $(populate);
  $(bind);
}());
