(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['share.hbs'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "\n    <div class=\"share-container\">\n      <div class=\"share-icon twitter-share\" style=\"display: none\">\n        <a href=\"\">\n       <div class=\"genericon genericon-twitter\">\n       <div class=\"share-text\"> Tweet </div>\n       </div>\n        <div class=\"count\"> </div>\n        </a>\n      </div>\n\n      <div class=\"share-icon facebook-share\" style=\"display: none\">\n        <a href=\"\">\n       <div class=\"genericon genericon-facebook-alt\">\n       <div class=\"share-text\"> Share </div>\n       </div>\n        <div class=\"count\"> </div>\n        </a>\n      </div>\n\n      <div class=\"share-icon google-share\" style=\"display: none\">\n        <a href=\"\">\n       <div class=\"genericon genericon-googleplus-alt\">\n       <div class=\"share-text\"> Share </div>\n       </div>\n        <div class=\"count\"> </div>\n        </a>\n      </div>\n\n      <div class=\"line-break\"> </div>\n\n      <div class=\"share-icon linkedin-share\" style=\"display: none\">\n        <a href=\"\">\n       <div class=\"genericon genericon-linkedin\">\n       <div class=\"share-text\"> Share </div>\n       </div>\n        <div class=\"count\"> </div>\n        </a>\n      </div>\n\n      <div class=\"share-icon pinterest-share\" style=\"display: none\">\n        <a href=\"\">\n       <div class=\"genericon genericon-pinterest\">\n       <div class=\"share-text\"> Pin </div>\n       </div>\n        <div class=\"count\"> </div>\n        </a>\n      </div>\n    </div>\n";
},"useData":true});
})();
jQuery(document).ready(function($) {
  var templateHtml = Handlebars.templates['share.hbs']();
  var serverContainers = $('.thinkfaster .share-server-container');

  for (var i = 0; i < serverContainers.length; ++i) {
    var serverContainer = serverContainers[i];
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


    initShareFasterButtons($, serverContainer, url, title, imageUrl,
        settings);
  }
});

var initShareFasterButtons = function($, container, url, title, imageUrl, settings) {
  // var url = 'http://thinkfaster.co/2015/02/why-rockstar-developers-dont-ask-for-help';

  // var title = 'Why Rockstar Developers Don\'t Ask For Help';
  // var imageUrl = 'http%3A%2F%2Ffarm8.staticflickr.com%2F7027%2F6851755809_df5b2051c9_z.jpg';

  console.log('initShareFasterButtons');
  var escapedUrl = escape(url);

  var openWindow = function(url, title) {
      window.open(url, title, 'height=320, width=640, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, directories=no, status=no');

  };

  var loadFacebook = function() {
    var query = escape('SELECT like_count,share_count FROM link_stat WHERE url = \'' + url + '\'')

    var facebookShareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + escapedUrl;
    var facebookUrl = 'http://graph.facebook.com/fql?q=' + query;


    $(container).find('.facebook-share a').click(function() {
      openWindow(facebookShareUrl, 'facebook_share');
    });

    var success = function(returnData) {
      var total = 0;
      if (returnData['data'] && returnData['data'].length) {
        var d = returnData['data'][0];
        total = d.like_count + d.share_count;
      }
      $(container).find('.facebook-share .count').html(total);
      $(container).find('.facebook-share').show();
    };

    $.ajax({
      url: facebookUrl,
      data: {},
      success: success,
      dataType: 'json'
    });
  };

  var loadTwitter = function() {
    var twitterUrl = 'http://urls.api.twitter.com/1/urls/count.json?url=' + escapedUrl;

    var twitterShareUrl = 'https://twitter.com/intent/tweet'
    var text = escape(title);
    twitterShareUrl += '?url=' + escapedUrl + '&text=' + text;

    if (settings.twitterHandle) {
      twitterShareUrl += '&via=' + settings.twitterHandle;
    }

    $(container).find('.twitter-share a').click(function() {
      openWindow(twitterShareUrl, 'twitter_share');
    });

    var success = function(returnData) {
      var total = 0;
      if (returnData && returnData['count']) {
        total = returnData['count'];
      }
      $(container).find('.twitter-share .count').html(total);
      $(container).find('.twitter-share').show();
    }
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
    $(container).find('.google-share a').click(function() {
      openWindow(googleShareUrl, 'google_share');
    });

    var ajaxUrl = WP_params.ajaxUrl;
    $.post(ajaxUrl, {
      action: 'get-plus1-count',
      url: url
    }).done(function( data ) {
      var total = parseInt(JSON.parse(data))
      $(container).find('.google-share .count').html(total);
      $(container).find('.google-share').show();
    });
  };

  var loadLinkedin = function() {
    var shareUrl = 'https://www.linkedin.com/shareArticle?mini=true&' +
        'url=' + escapedUrl + '&title=' + escape(title)
    $(container).find('.linkedin-share a').click(function() {
      openWindow(shareUrl, 'LinkedIn_share');
    });


    var linkedinUrl = 'http://www.linkedin.com/countserv/count/share' +
        '?format=jsonp&url=' + escapedUrl;
    var success = function(returnData) {
      var total = 0;
      if (returnData && returnData['count']) {
        total = returnData['count'];
      }
      $(container).find('.linkedin-share .count').html(total);
      $(container).find('.linkedin-share').show();
    }
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
        escapedUrl + '&media=' + imageUrl + '&description=' + escape(title);

    $(container).find('.pinterest-share a').click(function() {
      openWindow(shareUrl, 'Pinterest_share');
    });

    var pinterestUrl = 'http://api.pinterest.com/v1/urls/count.json?url=' + escapedUrl;
    var success = function(returnData) {
      var total = 0;
      if (returnData && returnData['count'] != undefined) {
        total = returnData['count'];
      }
      $(container).find('.pinterest-share .count').html(total);
      $(container).find('.pinterest-share').show();
    }
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
