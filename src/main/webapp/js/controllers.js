angular.module('BookStoreApp.controllers', [])


.controller('AppCtrl', ['$rootScope', '$ionicModal', 'AuthFactory', '$location', 'UserFactory',
    '$scope', 'Loader', 'oauth2Provider',
	function($rootScope, $ionicModal, AuthFactory, $location, UserFactory, $scope, Loader, oauth2Provider) {

		$rootScope.$on('showLoginModal', function($event, scope, cancelCallback, callback) {
			$scope.user = {
				name: '',
			  email: '',
				password: ''
			};

			$scope = scope || $scope;

			$scope.viewLogin = true;

			$ionicModal.fromTemplateUrl('templates/loginmsg.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();

				$scope.switchTab = function(tab) {
					if (tab === 'login')
						$scope.viewLogin = true;
					else
						$scope.viewLogin = false;
				};

				$scope.hide = function() {
					$scope.modal.hide();
					if (typeof cancelCallback === 'function') {
						cancelCallback();
					}
				};

				$scope.login = function() {
					Loader.showLoading('Authenticating...');

					UserFactory.login($scope.user).success(function(data) {

						data = data.data;
						AuthFactory.setUser(data.user);
						AuthFactory.setToken({
							token: data.token,
							expires: data.expires
						});

						$rootScope.isAuthenticated = true;
						$scope.modal.hide();
						Loader.hideLoading();
						if (typeof callback === 'function')
							callback();

					}).error(function(err, statusCode) {
						Loader.hideLoading();
						Loader.toggleLoadingWithMessage(err.message);
					});
				};

				/**
				 * Controlador del boton de darle login
				 */
				//Button signIn				
				 $scope.singIn = function () {
					 $scope.test = 'Si estoy entrando pero seguro falta configurar el provider o algo mas :v';
			            oauth2Provider.signIn(function () {
			                gapi.client.oauth2.userinfo.get().execute(function (resp) {
			                    $scope.$apply(function () {
			                    	if (!resp.code) {
			                    		oauth2Provider.signedIn = true;
				                        $scope.alertStatus = 'success';
				                        $scope.rootMessages = 'Logged in with ' + resp.email;
				                        $scope.segundomensaje = "Exito!"
			                		}else {
			                			oauth2Provider.signedIn = true;
			                			$scope.alertStatus = 'Algo fallo';
			                			$scope.rootMessages = 'Logged in with ' + resp.email;
			                			$scope.segundomensaje = "Algo Falla!";
			                		}
			                    });
			                });
			            });
			        };
			
			});
		});

		$rootScope.loginFromMenu = function() {
			$rootScope.$broadcast('showLoginModal', $scope, null, null);
		};

		$rootScope.logout = function() {
			UserFactory.logout();
			$rootScope.isAuthenticated = false;
			$location.path('/app/browse');
			Loader.toggleLoadingWithMessage('Successfully Logged Out!', 2000);
		}
	}
])


.controller('RootCtrl', function ($scope, $location, oauth2Provider) {

    /**
     * Returns if the viewLocation is the currently viewed page.
     *
     * @param viewLocation
     * @returns {boolean} true if viewLocation is the currently viewed page. Returns false otherwise.
     */
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    /**
     * Returns the OAuth2 signedIn state.
     *
     * @returns {oauth2Provider.signedIn|*} true if siendIn, false otherwise.
     */
    $scope.getSignedInState = function () {
        return oauth2Provider.signedIn;
    };

    /**
     * Calls the OAuth2 authentication method.
     */
    $scope.signIn = function () {
        oauth2Provider.signIn(function () {
            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                $scope.$apply(function () {
                    if (resp.email) {
                        oauth2Provider.signedIn = true;
                        $scope.alertStatus = 'success';
                        $scope.rootMessages = 'Logged in with ' + resp.email;
                    }
                });
            });
        });
    };

    /**
     * Render the signInButton and restore the credential if it's stored in the cookie.
     * (Just calling this to restore the credential from the stored cookie. So hiding the signInButton immediately
     *  after the rendering)
     */
    $scope.initSignInButton = function () {
        gapi.signin.render('signInButton', {
            'callback': function () {
                jQuery('#signInButton button').attr('disabled', 'true').css('cursor', 'default');
                if (gapi.auth.getToken() && gapi.auth.getToken().access_token) {
                    $scope.$apply(function () {
                        oauth2Provider.signedIn = true;
                    });
                }
            },
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'scope': oauth2Provider.SCOPES
        });
    };

    /**
     * Logs out the user.
     */
    $scope.signOut = function () {
        oauth2Provider.signOut();
        $scope.alertStatus = 'success';
        $scope.rootMessages = 'Logged out';
    };

    /**
     * Collapses the navbar on mobile devices.
     */
    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };

})

/*
.controller('OAuth2LoginModalCtrl',
    function ($scope, $modalInstance, $rootScope, oauth2Provider) {
        $scope.singInViaModal = function () {
            oauth2Provider.signIn(function () {
                gapi.client.oauth2.userinfo.get().execute(function (resp) {
                    $scope.$root.$apply(function () {
                        oauth2Provider.signedIn = true;
                        $scope.$root.alertStatus = 'success';
                        $scope.$root.rootMessages = 'Logged in with ' + resp.email;
                    });

                    $modalInstance.close();
                });
            });
        };
    })
*/

.controller('listBooksCtrl',
    function ($scope, $log, Loader) {
        $scope.submitted = false;
        $scope.loading = false;
 
        //Loader.showLoading();
        
        $scope.showAllBooks = function () {
            $scope.loading = true;
            gapi.client.libreriapp.listBooks().execute(function(resp) {
            	$scope.$apply(function () {
            		if (!resp.code) {
                        resp.items = resp.items || [];
                        
                        Loader.showLoading();
                        
                        $scope.thebooks = [];
                        $scope.justtest = resp.items;
                        angular.forEach(resp.items, function(book) {
                        	$scope.thebooks.push(book);
                        });
                        
                        //$scope.$apply();
                        Loader.hideLoading();
            		}
            	});                   
            });
        };
        
        //Call for my method
        //showAllBooks();
    })
    
.controller('singleBookCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', '$rootScope', 'UserFactory', 'Loader',
	function($scope, $state, LSFactory, AuthFactory, $rootScope, UserFactory, Loader) {

		var myVar = $state.params.bookId;
		
		$scope.bookId = {
				"bookId": myVar
		};
		
		$scope.listOneBook = function () {
            $scope.submitted = true;
            $scope.loading = true;
            
            $scope.tmp = myVar;
            
            gapi.client.libreriapp.listOneBook($scope.bookId).execute(function(resp) {
                    if (!resp.code) {
                            $scope.book = resp.result;
                            $scope.$apply();
                    }else {
                    	var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    }
            });
        };

	}
])    

.controller('venderCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', '$rootScope', 'UserFactory', 'Loader',
	function($scope, $state, LSFactory, AuthFactory, $rootScope, UserFactory, Loader) {

		//Vender

	}
])    

.controller('BookCtrl', ['$scope', '$state', 'LSFactory', 'AuthFactory', '$rootScope', 'UserFactory', 'Loader',
	function($scope, $state, LSFactory, AuthFactory, $rootScope, UserFactory, Loader) {

		var bookId = $state.params.bookId;
		$scope.book = LSFactory.get(bookId);
		
		$scope.listOneBook = function () {
            $scope.submitted = true;
            $scope.loading = true;
            
            //console.log("BookId");
    		//console.log(BookId);
            
            gapi.client.libreriapp.listOneBook($state.params.bookId).execute(function(resp) {
                    if (!resp.code) {
                            $scope.book = resp.result;
                    }
            });
        };

		$scope.$on('addToCart', function() {
			Loader.showLoading('Adding to Cart..');
			UserFactory.addToCart({
				id: bookId,
				qty: 1
			}).success(function(data) {
				Loader.hideLoading();
				Loader.toggleLoadingWithMessage('Successfully added ' + $scope.book.title + ' to your cart', 2000);
			}).error(function(err, statusCode) {
				Loader.hideLoading();
				Loader.toggleLoadingWithMessage(err.message);
			});
		});

		$scope.addToCart = function() {
			if (!AuthFactory.isLoggedIn()) {
				$rootScope.$broadcast('showLoginModal', $scope, null, function() {
					// user is now logged in
					$scope.$broadcast('addToCart');
				});
				return;
			}
			$scope.$broadcast('addToCart');
		}
	}
])

.controller('CartCtrl', ['$scope', 'AuthFactory', '$rootScope', '$location', '$timeout', 'UserFactory', 'Loader',
	function($scope, AuthFactory, $rootScope, $location, $timeout, UserFactory, Loader) {

		$scope.$on('getCart', function() {
			Loader.showLoading('Fetching Your Cart..');
			UserFactory.getCartItems().success(function(data) {
				$scope.books = data.data;
				Loader.hideLoading();
			}).error(function(err, statusCode) {
				Loader.hideLoading();
				Loader.toggleLoadingWithMessage(err.message);
			});
		});

		if (!AuthFactory.isLoggedIn()) {
			$rootScope.$broadcast('showLoginModal', $scope, function() {
				// cancel auth callback
				$timeout(function() {
					$location.path('/app/browse');
				}, 200);
			}, function() {
				// user is now logged in
				$scope.$broadcast('getCart');
			});
			return;
		}

		$scope.$broadcast('getCart');

		$scope.checkout = function() {
		   // we need to send only the id and qty
			var _cart = $scope.books;
			var cart = [];
			for (var i = 0; i < _cart.length; i++) {
				cart.push({
					id: _cart[i]._id,
					qty: 1 // hardcoded to 1
				});
			}

			Loader.showLoading('Checking out..');
			UserFactory.addPurchase(cart).success(function(data) {
				Loader.hideLoading();
				Loader.toggleLoadingWithMessage('Successfully checked out', 2000);
				$scope.books = [];
			}).error(function(err, statusCode) {
				Loader.hideLoading();
				Loader.toggleLoadingWithMessage(err.message);
			});
		}
	}
])

.controller('PurchasesCtrl', ['$scope', '$rootScope', 'AuthFactory', 'UserFactory', '$timeout', 'Loader',
	function($scope, $rootScope, AuthFactory, UserFactory, $timeout, Loader) {
		// http://forum.ionicframework.com/t/expandable-list-in-ionic/3297/2
		$scope.groups = [];

		$scope.toggleGroup = function(group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};
		$scope.isGroupShown = function(group) {
			return $scope.shownGroup === group;
		};

		$scope.$on('getPurchases', function() {
			Loader.showLoading('Fetching Your Purchases');
			UserFactory.getPurchases().success(function(data) {
				var purchases = data.data;
				$scope.purchases = [];
				for (var i = 0; i < purchases.length; i++) {
					var key = Object.keys(purchases[i]);
					$scope.purchases.push(key[0]);
					$scope.groups[i] = {
						name: key[0],
						items: purchases[i][key]
					};
					var sum = 0;
					for (var j = 0; j < purchases[i][key].length; j++) {
						sum += parseInt(purchases[i][key][j].price);
					}
					$scope.groups[i].total = sum;
				}
				Loader.hideLoading();
			}).error(function(err, statusCode) {
				Loader.hideLoading();
				Loader.toggleLoadingWithMessage(err.message);
			});
		});

		if (!AuthFactory.isLoggedIn()) {
			$rootScope.$broadcast('showLoginModal', $scope, function() {
				// cancel auth callback
				$timeout(function() {
					$location.path('/app/browse');
				}, 200);
			}, function() {
				// user is now logged in
				$scope.$broadcast('getPurchases');
			});
			return;
		}
		$scope.$broadcast('getPurchases');
	}
]);
