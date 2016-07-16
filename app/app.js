'use strict';

angular.module('jqueryContextmenuRtlApp', ['jqueryContextmenuRtlApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'ui.router', 'ui.bootstrap']).config(function ($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);
});
//# sourceMappingURL=app.js.map

'use strict';

angular.module('jqueryContextmenuRtlApp.util', []);
//# sourceMappingURL=util.module.js.map

"use strict";

(function (angular, undefined) {
	angular.module("jqueryContextmenuRtlApp.constants", []).constant("appConfig", {
		"userRoles": ["guest", "user", "admin"]
	});
})(angular);
//# sourceMappingURL=app.constant.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($http) {
      _classCallCheck(this, MainController);

      $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
      });

      $.contextMenu({
        selector: '.context-menu-one',
        rtl: true,
        trigger: 'left',
        callback: function callback(key, options) {
          var m = "clicked: " + key;
          window.console && console.log(m) || alert(m);
        },
        items: {
          "edit": { "name": "ערוך", "icon": "edit" },
          "cut": { "name": "גזור", "icon": "cut" },
          "sep1": "---------",
          "quit": { "name": "סגור", "icon": "quit" },
          "sep2": "---------",
          "fold1": {
            "name": "תת קבוצה",
            "items": {
              "fold1-key1": { "name": "תקייה 1" },
              "fold2": {
                "name": "תת קבוצה 2",
                "items": {
                  "fold2-key1": { "name": "אלפא" },
                  "fold2-key2": { "name": "בטא" },
                  "fold2-key3": { "name": "גמא" }
                }
              },
              "fold1-key3": { "name": "דלתא" }
            }
          },
          "fold1a": {
            "name": "שונות",
            "items": {
              "fold1a-key1": { "name": "אפסילון" },
              "fold1a-key2": { "name": "קפא" },
              "fold1a-key3": { "name": "אומגה" }
            }
          }
        }
      });
    }

    _createClass(MainController, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        this.$http.get('/api/things').then(function (response) {
          _this.awesomeThings = response.data;
        });
      }
    }]);

    return MainController;
  }();

  angular.module('jqueryContextmenuRtlApp').component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('jqueryContextmenuRtlApp').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/',
    template: '<main></main>'
  });
});
//# sourceMappingURL=main.js.map

'use strict';

angular.module('jqueryContextmenuRtlApp').directive('footer', function () {
  return {
    templateUrl: 'components/footer/footer.html',
    restrict: 'E',
    link: function link(scope, element) {
      element.addClass('footer');
    }
  };
});
//# sourceMappingURL=footer.directive.js.map

'use strict';

angular.module('jqueryContextmenuRtlApp').factory('Modal', function ($rootScope, $uibModal) {
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  function openModal() {
    var scope = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var modalClass = arguments.length <= 1 || arguments[1] === undefined ? 'modal-default' : arguments[1];

    var modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    return $uibModal.open({
      templateUrl: 'components/modal/modal.html',
      windowClass: modalClass,
      scope: modalScope
    });
  }

  // Public API here
  return {

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */

      delete: function _delete() {
        var del = arguments.length <= 0 || arguments[0] === undefined ? angular.noop : arguments[0];

        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return function () {
          var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click: function click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click: function click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(function (event) {
            del.apply(event, args);
          });
        };
      }
    }
  };
});
//# sourceMappingURL=modal.service.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController = function NavbarController() {
  _classCallCheck(this, NavbarController);
};

//end-non-standard

angular.module('jqueryContextmenuRtlApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map

'use strict';

angular.module('jqueryContextmenuRtlApp').directive('navbar', function () {
  return {
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  };
});
//# sourceMappingURL=navbar.directive.js.map

'use strict';

(function () {

  /**
   * The Util service is for thin, globally reusable, utility functions
   */
  function UtilService($window) {
    var Util = {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */

      safeCb: function safeCb(cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      },


      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
      urlParse: function urlParse(url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },


      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
      isSameOrigin: function isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = origins && [].concat(origins) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          var hostnameCheck = url.hostname === o.hostname;
          var protocolCheck = url.protocol === o.protocol;
          // 2nd part of the special treatment for IE fix (see above): 
          // This part is when using well-known ports 80 or 443 with IE,
          // when $window.location.port==='' instead of the real port number.
          // Probably the same cause as this IE bug: https://goo.gl/J9hRta
          var portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port === '443');
          return hostnameCheck && protocolCheck && portCheck;
        });
        return origins.length >= 1;
      }
    };

    return Util;
  }

  angular.module('jqueryContextmenuRtlApp.util').factory('Util', UtilService);
})();
//# sourceMappingURL=util.service.js.map

angular.module("jqueryContextmenuRtlApp").run(["$templateCache", function($templateCache) {$templateCache.put("components/footer/footer.html","<div class=\"container\">\n  <p>Angular Fullstack v3.7.5 |\n    <a href=\"https://twitter.com/tyhenkel\">@tyhenkel</a> |\n    <a href=\"https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open\">Issues</a>\n  </p>\n</div>\n");
$templateCache.put("app/main/main.html","<navbar></navbar>\n\n<!-- Page Content -->\n<div class=\"container\">\n\n  <div class=\"row\">\n\n    <div class=\"col-md-12\">\n      <div class=\"col-xs-12\">\n        <h2>RTL Support for jQuery contextMenu</h2>\n        <hr>\n        <a href=\"https://swisnl.github.io/jQuery-contextMenu/\" target=\"_blank\">\n          <h4>jQuery contextMenu Full Documentation</h4>\n        </a>\n      </div>\n      <div class=\"col-xs-12\" style=\"margin: 15px 0;\">\n        <button type=\"button\" class=\"context-menu-one btn btn-default btn-lg pull-right\">click me</button>\n      </div>\n      <div class=\"col-xs-12\">\n        <pre class=\"prettyprint language-json prettyprinted\" data-type=\"json\"><code>\n$(<span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">()</span></span>{\n    <span class=\"hljs-comment\"></span>\n    $.contextMenu({\n        selector: <span class=\"str\">\'.context-menu-one\'</span>,\n        rtl: <span class=\"str\">true</span>,\n        callback: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span><span class=\"hljs-params\">(key, options)</span> </span>{\n            <span class=\"hljs-keyword\">var</span> m = <span class=\"str\">\"clicked: \"</span> + key;\n            <span class=\"hljs-built_in\">window</span>.console &amp;&amp; <span class=\"hljs-built_in\">console</span>.log(m) || alert(m);\n        },\n        items: {\n            <span class=\"str\">\"edit\"</span>: {<span class=\"str\">\"name\"</span>: <span class=\"str\">\"ערוך\"</span>, <span\n          class=\"str\">\"icon\"</span>: <span class=\"str\">\"edit\"</span>},\n            <span class=\"str\">\"cut\"</span>: {<span class=\"str\">\"name\"</span>: <span class=\"str\">\"גזור\"</span>, <span\n          class=\"str\">\"icon\"</span>: <span class=\"str\">\"cut\"</span>},\n            <span class=\"str\">\"sep1\"</span>: <span class=\"str\">\"---------\"</span>,\n            <span class=\"str\">\"quit\"</span>: {<span class=\"str\">\"name\"</span>: <span class=\"str\">\"סגור\"</span>, <span\n          class=\"str\">\"icon\"</span>: <span class=\"str\">\"quit\"</span>},\n            <span class=\"str\">\"sep2\"</span>: <span class=\"str\">\"---------\"</span>,\n            <span class=\"str\">\"fold1\"</span>: {\n                <span class=\"str\">\"name\"</span>: <span class=\"str\">\"תת קבוצה\"</span>,\n                <span class=\"str\">\"items\"</span>: {\n                    <span class=\"str\">\"fold1-key1\"</span>: {<span class=\"str\">\"name\"</span>: <span\n          class=\"str\">\"תקייה 1\"</span>},\n                    <span class=\"str\">\"fold2\"</span>: {\n                        <span class=\"str\">\"name\"</span>: <span class=\"str\">\"תת קבוצה 2\"</span>,\n                        <span class=\"str\">\"items\"</span>: {\n                            <span class=\"str\">\"fold2-key1\"</span>: {<span class=\"str\">\"name\"</span>: <span class=\"str\">\"אלפא\"</span>},\n                            <span class=\"str\">\"fold2-key2\"</span>: {<span class=\"str\">\"name\"</span>: <span class=\"str\">\"בטא\"</span>},\n                            <span class=\"str\">\"fold2-key3\"</span>: {<span class=\"str\">\"name\"</span>: <span class=\"str\">\"גמא\"</span>}\n                        }\n                    },\n                    <span class=\"str\">\"fold1-key3\"</span>: {<span class=\"str\">\"name\"</span>: <span\n          class=\"str\">\"דלתא\"</span>}\n                }\n            },\n            <span class=\"str\">\"fold1a\"</span>: {\n                <span class=\"str\">\"name\"</span>: <span class=\"str\">\"שונות\"</span>,\n                <span class=\"str\">\"items\"</span>: {\n                    <span class=\"str\">\"fold1a-key1\"</span>: {<span class=\"str\">\"name\"</span>: <span class=\"str\">\"אפסילון\"</span>},\n                    <span class=\"str\">\"fold1a-key2\"</span>: {<span class=\"str\">\"name\"</span>: <span\n          class=\"str\">\"קפא\"</span>},\n                    <span class=\"str\">\"fold1a-key3\"</span>: {<span class=\"str\">\"name\"</span>: <span\n          class=\"str\">\"אומגה\"</span>}\n                }\n            }\n        }\n    });\n});\n</code></pre>\n      </div>\n\n    </div>\n\n  </div>\n\n</div>\n<!-- /.container -->\n\n<div class=\"container\">\n\n  <!-- Footer -->\n  <footer>\n    <div class=\"row\">\n      <div class=\"col-lg-12\">\n        <p>Copyright &copy; Your Website 2014</p>\n      </div>\n    </div>\n  </footer>\n\n</div>\n<!-- /.container -->\n");
$templateCache.put("components/modal/modal.html","<div class=\"modal-header\">\n  <button ng-if=\"modal.dismissable\" type=\"button\" ng-click=\"$dismiss()\" class=\"close\">&times;</button>\n  <h4 ng-if=\"modal.title\" ng-bind=\"modal.title\" class=\"modal-title\"></h4>\n</div>\n<div class=\"modal-body\">\n  <p ng-if=\"modal.text\" ng-bind=\"modal.text\"></p>\n  <div ng-if=\"modal.html\" ng-bind-html=\"modal.html\"></div>\n</div>\n<div class=\"modal-footer\">\n  <button ng-repeat=\"button in modal.buttons\" ng-class=\"button.classes\" ng-click=\"button.click($event)\" ng-bind=\"button.text\" class=\"btn\"></button>\n</div>\n");
$templateCache.put("components/navbar/navbar.html","<div class=\"navbar navbar-default navbar-static-top\" ng-controller=\"NavbarController\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <!--<button class=\"navbar-toggle\" type=\"button\" ng-click=\"nav.isCollapsed = !nav.isCollapsed\">-->\n        <!--<span class=\"sr-only\">Toggle navigation</span>-->\n        <!--<span class=\"icon-bar\"></span>-->\n        <!--<span class=\"icon-bar\"></span>-->\n        <!--<span class=\"icon-bar\"></span>-->\n      <!--</button>-->\n      <a href=\"/\" class=\"navbar-brand\">jquery-contextmenu-rtl</a>\n    </div>\n    <div uib-collapse=\"nav.isCollapsed\" class=\"navbar-collapse collapse\" id=\"navbar-main\">\n      <ul class=\"nav navbar-nav\">\n        <li ng-repeat=\"item in nav.menu\" ui-sref-active=\"active\">\n            <a ui-sref=\"{{item.state}}\">{{item.title}}</a>\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n");}]);