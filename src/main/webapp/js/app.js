// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('BookStoreApp', ['ionic', 'BookStoreApp.controllers', 'BookStoreApp.factory'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})


.run(['$rootScope', 'AuthFactory',
    function($rootScope, AuthFactory) {

        $rootScope.isAuthenticated = AuthFactory.isLoggedIn();

        // utility method to convert number to an array of elements
        $rootScope.getNumber = function(num) {
            return new Array(num);
        }

    }
])


.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        // setup the token interceptor
        $httpProvider.interceptors.push('TokenInterceptor');

        $stateProvider

            .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('app.browse', {
            url: "/browse",
            views: {
                'menuContent': {
                    templateUrl: "templates/browse.html",
                    controller: 'listBooksCtrl'
                }
            }
        })

        .state('app.book', {
            url: "/book/:bookId",
            views: {
                'menuContent': {
                    templateUrl: "templates/book.html",
                    controller: 'singleBookCtrl'
                }
            }
        })

        .state('app.vender', {
        	url: "/vender",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/vender.html",
        			controller: 'venderCtrl'
        		}
        	}
        })
        
        .state('app.mylibrary', {
        	url: "/mylibrary",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/mylibrary.html",
        			controller: 'mylibraryCtrl'
        		}
        	}
        })
        
        .state('app.mypurchases', {
        	url: "/mypurchases",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/mypurchases.html",
        			controller: 'mypurchasesCtrl'
        		}
        	}
        })
        
        .state('app.myexchanges', {
        	url: "/myexchanges",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/myexchanges.html",
        			controller: 'myexchangesCtrl'
        		}
        	}
        })
        
        .state('app.transactions', {
        	url: "/transactions",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/transactions.html",
        			controller: 'transactionsCtrl'
        		}
        	}
        })
        
        .state('app.pendingpurchases', {
        	url: "/pendingpurchases",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/pendingpurchases.html",
        			controller: 'pendingpurchasesCtrl'
        		}
        	}
        })
        
        .state('app.pendingexchanges', {
        	url: "/pendingexchanges",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/pendingexchanges.html",
        			controller: 'pendingexchangesCtrl'
        		}
        	}
        })
        
        .state('app.bookforpurchase', {
            url: "/bookforpurchase/:bookId",
            views: {
                'menuContent': {
                    templateUrl: "templates/bookforpurchase.html",
                    controller: 'bookforpurchaseCtrl'
                }
            }
        })
        
        .state('app.bookforexchange', {
            url: "/bookforexchange/:bookId",
            views: {
                'menuContent': {
                    templateUrl: "templates/bookforexchange.html",
                    controller: 'bookforexchangeCtrl'
                }
            }
        })
        
        .state('app.profile', {
        	url: "/profile",
        	views: {
        		'menuContent': {
        			templateUrl: "templates/profile.html",
        			controller: 'profileCtrl'
        		}
        	}
        })
  
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/browse');
    }
])
