(function() {
  'use strict';

  angular.module('app.services')
    .factory('Language', LanguageFactory);

  /** @ngInject */
  function LanguageFactory($http, $q, gettextCatalog, lodash) {
    var availableAvailable = $q.defer();
    var service = {
      available: {
        'en': 'English',  // not translated on purpose
      },
      ready: availableAvailable.promise,
      onLogin: onLogin,
      onReload: onReload,
      chosen: {
        code: null,
      },
      setLocale: setLocale,
    };

    init();

    return service;

    function init() {
      $http.get('gettext/json/available_languages.json')
      .then(function(response) {
        lodash.extend(service.available, response.data);
        availableAvailable.resolve(service.available);
      });
    }

    function setLocale(code) {
      gettextCatalog.loadAndSet(code);

      return code;
    }

    function getLocale(data) {
      return data
        && data.settings
        && data.settings.locale;
    }

    function onLogin(data) {
      var code = 'en';
      if (!service.chosen.code || (service.chosen.code === '_user_')) {
        code = getLocale(data);
      } else {
        code = service.chosen.code;
      }

      setLocale(code);
    }

    function onReload(data) {
      var code = getLocale(data);
      setLocale(code);
    }

    function save(code) {
      if (!service.user_href) {
        console.error('Trying to save language selection without a valid user_href');

        return;
      }

      if (code === '_browser_') {
        code = null;
      }

      return $http.post(service.user_href, {
        action: 'edit',
        resource: {
          settings: {
            ui_self_service: {
              display: {
                locale: code,
              },
            },
          },
        },
      });
    }
  }
})();
