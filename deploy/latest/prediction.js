// Generated by CoffeeScript 1.6.3
(function() {
  var PredictionAPI, Tracker,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  jQuery(document).ready(function() {
    return new Tracker();
  });

  PredictionAPI = (function() {
    function PredictionAPI(url, apiKey) {
      this.request = __bind(this.request, this);
      this.registerUserItemAction = __bind(this.registerUserItemAction, this);
      this.registerItem = __bind(this.registerItem, this);
      this.registerUser = __bind(this.registerUser, this);
      this.url = url;
      this.apiKey = apiKey;
    }

    PredictionAPI.prototype.registerUser = function(userId) {
      return this.request('users.json', {
        pio_uid: userId
      });
    };

    PredictionAPI.prototype.registerItem = function(itemId, categoriesIds) {
      if (categoriesIds == null) {
        categoriesIds = [];
      }
      return this.request('items.json', {
        pio_iid: itemId
      }, categoriesIds.join(','));
    };

    PredictionAPI.prototype.registerUserItemAction = function(userId, itemId, action) {
      return this.request('actions/u2i.json', {
        pio_uid: userId,
        pio_iid: itemId,
        pio_action: action
      });
    };

    PredictionAPI.prototype.request = function(path, data) {
      data['pio_appkey'] = this.apiKey;
      return jQuery.ajax({
        crossDomain: true,
        url: "" + this.url + "/" + path,
        type: 'POST',
        data: data
      });
    };

    return PredictionAPI;

  })();

  Tracker = (function() {
    Tracker.API_KEY = '3ZyaNfVEcyE5kUsZSJipRuN3gfdLl85t8VvWn5F8QhHhi24xXX1vhjKdX8r6vFOz';

    Tracker.API_URL = 'http://193.107.237.171:8000';

    function Tracker() {
      this.userId = __bind(this.userId, this);
      this.generateUserId = __bind(this.generateUserId, this);
      this.api = new PredictionAPI(this.API_URL, this.API_KEY);
      jQuery('.product-view').each(function(e) {
        var form, item;
        if (form = jQuery('form', jQuery(e)).first()) {
          if (item = /^.*\/(\d+)\//.exec(form.action)[1]) {
            this.api.registerItem(item);
            jQuery(form).find('.add-to-cart button').click(function() {
              this.api.registerUserItemAction(this.userId(), item, 'conversion');
              return true;
            });
            jQuery(form).find('.link-wishlist').click(function() {
              this.api.registerUserItemAction(this.userId(), item, 'like');
              return true;
            });
            return this.api.registerUserItemAction(this.userId(), item, 'view');
          }
        }
      });
    }

    Tracker.prototype.generateUserId = function() {
      var alphabet, i, random_user_id;
      random_user_id = '';
      alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      i = 0;
      while (i < 8) {
        random_user_id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        i++;
      }
      return random_user_id;
    };

    Tracker.prototype.userId = function() {
      var user_id;
      user_id = jQuery.cookie('puid');
      if (!user_id) {
        this.api.registerUser(user_id);
        jQuery.cookie('puid', user_id, {
          expires: 9999,
          domain: ''
        });
      }
      return user_id;
    };

    return Tracker;

  })();

}).call(this);
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
        } catch(e) {
            return;
        }

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));