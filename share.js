
jQuery(document).ready(function($) {

  var templateHtml = Handlebars.templates['share.hbs']();
  var serverContainers = $('.thinkfaster .share-server-container');

  var minimumShareCount = 0;

  for (var i = 0; i < serverContainers.length; ++i) {
    var serverContainer = serverContainers[i];
    var containerSel = $(serverContainer);
    $(serverContainer).append(templateHtml);
    var url = serverContainer.dataset['url'];
    var title = serverContainer.dataset['title'];
    var imageUrl = serverContainer.dataset['imageurl'] || '';

    var settings = {};
    settings.twitterHandle = serverContainer.dataset['twitterhandle'] || '';

    settings.enabledTwitter = serverContainer.dataset['enabledtwitter'];
    settings.enabledFacebook = serverContainer.dataset['enabledfacebook'];
    settings.enabledLinkedin = serverContainer.dataset['enabledlinkedin'];
    settings.enabledPinterest = serverContainer.dataset['enabledpinterest'];
    settings.enabledGooglePlus = serverContainer.dataset['enabledgoogleplus'];
    settings.minimumShareCount = parseInt(serverContainer.dataset['minimumShareCount']) || 0;

    if (!window['fasterShareInitUrlMap']) {
      window['fasterShareInitUrlMap'] = {};
    }

    initShareFasterButtons($, serverContainer, url, title, imageUrl,
        settings);
    window['fasterShareInitUrlMap'][url] = true;
  }
});
var showFacebook = function(container) {
  container.find('.facebook-share').show();
};

var showTwitter = function(container) {
  container.find('.twitter-share').show();
};

var showGooglePlus = function(container) {
  container.find('.google-share').show();
};
var showLinkedIn = function(container) {
  container.find('.linkedin-share').show();
};
var showPinterest = function(container) {
  container.find('.pinterest-share').show();
};

var initShareFasterButtons = function($, container, url, title, imageUrl, settings) {
  // var url = 'http://thinkfaster.co/2015/02/why-rockstar-developers-dont-ask-for-help';

  // var title = 'Why Rockstar Developers Don\'t Ask For Help';
  // var imageUrl = 'http%3A%2F%2Ffarm8.staticflickr.com%2F7027%2F6851755809_df5b2051c9_z.jpg';

  // console.log('initShareFasterButtons');
  var minimumShareCount = settings.minimumShareCount;
  var escapedUrl = encodeURIComponent(url);
  // var containerSelector = $(container);
  var containerSelector = $(
      '.thinkfaster .share-server-container[data-url="' + url + '"]');

  containerSelector.find('.share-icon').addClass('no-count');
  var maybeRemoveNoCount = function(count) {
    // Any one of the counts that has a count > minimumCount
    // will trigger ALL counts being shown.
    if (count >= minimumShareCount) {
      containerSelector.find('.share-icon').removeClass('no-count');
    }
  };

  var openWindow = function(url, title) {
      window.open(url, title, 'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');
      return false;
  };

  var loadFacebook = function() {
    var query = encodeURIComponent('SELECT like_count,share_count FROM link_stat WHERE url = \'' + url + '\'')

    var facebookShareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + escapedUrl;
    var facebookUrl = 'https://graph.facebook.com/fql?q=' + query;

    containerSelector.find('.facebook-share a').click(function() {
      return openWindow(facebookShareUrl, 'facebook_share');
    });

    var success = function(returnData) {
      var total = 0;
      if (returnData['data'] && returnData['data'].length) {
        var d = returnData['data'][0];
        total = d.like_count + d.share_count;
      }
      maybeRemoveNoCount(total);
      containerSelector.find('.facebook-share .count div').html(total);
      showFacebook(containerSelector);
    };
    if (window['fasterShareInitUrlMap'][url]) {
      // Ensure we only make the ajax query once, regardless
      // of how many times the count is being shown on the page.
      return;
    };

    $.ajax({
      url: facebookUrl,
      data: {},
      success: success,
      dataType: 'json'
    });
  };


  var loadTwitter = function() {
    var twitterUrl = 'https://cdn.api.twitter.com/1/urls/count.json?url=' + escapedUrl;

    var twitterShareUrl = 'https://twitter.com/intent/tweet'
    var text = encodeURIComponent(title);
    twitterShareUrl += '?url=' + escapedUrl + '&text=' + text;

    if (settings.twitterHandle) {
      twitterShareUrl += '&via=' + settings.twitterHandle;
    }

    containerSelector.find('.twitter-share a').click(function() {
      return openWindow(twitterShareUrl, 'twitter_share');
    });

    var success = function(returnData) {
      var total = 0;
      if (returnData && returnData['count']) {
        total = returnData['count'];
      }
      maybeRemoveNoCount(total);
      containerSelector.find('.twitter-share .count div').html(total);
      showTwitter(containerSelector);
    };
    if (window['fasterShareInitUrlMap'][url]) {
      // Ensure we only make the ajax query once, regardless
      // of how many times the count is being shown on the page.
      return;
    };
    $.ajax({
      url: twitterUrl,
      jsonp: "callback",
      data: {},
      success: success,
      dataType: 'jsonp'
    });
  };

  var loadGooglePlus = function() {
    var googleShareUrl = 'https://plus.google.com/share?url=' + escapedUrl;
    containerSelector.find('.google-share a').click(function() {
      return openWindow(googleShareUrl, 'google_share');
    });

    if (window['fasterShareInitUrlMap'][url]) {
      // Ensure we only make the ajax query once, regardless
      // of how many times the count is being shown on the page.
      return;
    };

    var ajaxUrl = WP_params.ajaxUrl;
    $.post(ajaxUrl, {
      action: 'get-plus1-count',
      url: url
    }).done(function( data ) {
      var total = parseInt(JSON.parse(data))
      maybeRemoveNoCount(total);
      containerSelector.find('.google-share .count div').html(total);
      showGooglePlus(containerSelector);
    });
  };

  var loadLinkedin = function() {
    var shareUrl = 'https://www.linkedin.com/shareArticle?mini=true&' +
        'url=' + escapedUrl + '&title=' + encodeURIComponent(title)
    $(container).find('.linkedin-share a').click(function() {
      return openWindow(shareUrl, 'LinkedIn_share');
    });

    var linkedinUrl = 'https://www.linkedin.com/countserv/count/share' +
        '?format=jsonp&url=' + escapedUrl;
    var success = function(returnData) {
      var total = 0;
      if (returnData && returnData['count']) {
        total = returnData['count'];
      }
      maybeRemoveNoCount(total);
      containerSelector.find('.linkedin-share .count div').html(total);
      showLinkedIn(containerSelector);
    };
    if (window['fasterShareInitUrlMap'][url]) {
      // Ensure we only make the ajax query once, regardless
      // of how many times the count is being shown on the page.
      return;
    };
    $.ajax({
      url: linkedinUrl,
      jsonp: "callback",
      data: {},
      success: success,
      dataType: 'jsonp'
    });
  };


  var loadPinterest = function() {
    var shareUrl = 'https://www.pinterest.com/pin/create/button/?url=' +
        escapedUrl + '&media=' + imageUrl + '&description=' + encodeURIComponent(title);

    $(container).find('.pinterest-share a').click(function() {
      return openWindow(shareUrl, 'Pinterest_share');
    });

    var pinterestUrl = 'https://api.pinterest.com/v1/urls/count.json?url=' + escapedUrl;
    var success = function(returnData) {
      var total = 0;
      if (returnData && returnData['count'] != undefined) {
        total = returnData['count'];
      }
      maybeRemoveNoCount(total);
      containerSelector.find('.pinterest-share .count div').html(total);
      showPinterest(containerSelector);
    }
    if (window['fasterShareInitUrlMap'][url]) {
      // Ensure we only make the ajax query once, regardless
      // of how many times the count is being shown on the page.
      return;
    };
    $.ajax({
      url: pinterestUrl,
      jsonp: "callback",
      data: {},
      success: success,
      dataType: 'jsonp'
    });
  };


  if (settings.enabledFacebook == 'on') {
    loadFacebook();
  }

  if (settings.enabledTwitter == 'on') {
    loadTwitter();
  }
  if (settings.enabledGooglePlus == 'on') {
    loadGooglePlus();
  }
  if (settings.enabledLinkedin == 'on') {
    loadLinkedin();
  }
  if (settings.enabledPinterest == 'on') {
    loadPinterest();
  }
};
