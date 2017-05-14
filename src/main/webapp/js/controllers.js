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
				
				//Mi OAuth2 Empieza acá
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
			    
			    
			    $scope.saveAPerson = function(dataPerson) {
			    	gapi.client.libreriapp.savePerson(dataPerson).execute(function(resp) {
		            	$scope.$apply(function () {
		            		if (!resp.code) {

		            			//El API retorna aca el usuario pero no lo necesito
		            			//por el momento
		            			$scope.falla = "hola men :v";
		            		}
		            		else {
		                    	var errorMessage = resp.error.message || '';
		                        $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
		                        $scope.alertStatus = 'warning';
		                        $scope.falla = "Hay una falla salvando";
		                        $log.error($scope.messages);
		                    }
		            	});                   
		            });
			    };
			    
				/**
				 * Controlador del boton de darle login
				 */
				//Button signIn				
				 $scope.singIn = function () {
					 //$scope.test = 'Si estoy entrando pero seguro falta configurar el provider o algo mas :v';
			            oauth2Provider.signIn(function () {
			                gapi.client.oauth2.userinfo.get().execute(function (resp) {
			                    $scope.$apply(function () {
			                    	if (!resp.code) {
			                    		oauth2Provider.signedIn = true;
			                    		$scope.isAuthenticated = oauth2Provider.signedIn;
				                        $scope.alertStatus = 'success';
				                        $scope.rootMessages = 'Logged in with ' + resp.email;
				                        $scope.segundomensaje = "Identificacion exitosa!"
				                        	
				                        //Hacer mi logica de negocio
				                        //salvar
				                        	
			                        	$scope.person = {
			                				"name": resp.name,
			                				"email": resp.email,
			                				"urlPicture": resp.picture
			                			};
				                        
				                        Loader.showLoading();
				                        $scope.saveAPerson($scope.person);
				                        
				                        $scope.$root.email = resp.email; 
				                        $scope.$root.name = resp.name;
				                        	
				                        //Ocultar el toggle
				                        Loader.hideLoading();
				                        
				                        //Cerrar el login
				                        $scope.modal.hide();
			                		}else {
			                			oauth2Provider.signedIn = false;
			                			$scope.isAuthenticated = oauth2Provider.signedIn;
			                			$scope.alertStatus = 'Algo fallo';
			                			$scope.rootMessages = 'Logged in with ' + resp.email;
			                			$scope.segundomensaje = "Aun no te encuentras autenticado!";
			                		}
			                    });
			                });
			            });
			        };
			
			});
		});

		//Cuando se da clic directamente en el menu y no se dispara por acción faltante
		$rootScope.loginFromMenu = function() {
			$rootScope.$broadcast('showLoginModal', $scope, null, null);
		};

		$scope.signOut = function () {
	        oauth2Provider.signOut();
	        $scope.isAuthenticated = oauth2Provider.signedIn;
	        $scope.alertStatus = 'success';
	        $scope.rootMessages = 'Logged out';
	        Loader.toggleLoadingWithMessage('Saliste!', 2000);
	    };
	    
	}
])


.controller('OAuth2LoginModalCtrl',
    function ($scope, $modalInstance, $rootScope, oauth2Provider) {
        $scope.singInViaModal = function () {
            oauth2Provider.signIn(function () {
                gapi.client.oauth2.userinfo.get().execute(function (resp) {
                    $scope.$root.$apply(function () {
                    	if (!resp.code) {
                    		oauth2Provider.signedIn = true;
                    		$scope.$root.isAuthenticated = oauth2Provider.signedIn;
	                        $scope.$root.alertStatus = 'success';
	                        $scope.$root.rootMessages = 'Logged in with ' + resp.email;
	                        $scope.$root.segundomensaje = "Exito por controlador!"
	                        	
	                        //Hacer mi logica de negocio
	                        //salvar
	                        
	                        	
	                        	
	                        //Cerrar el login
	                        $scope.modal.hide();
                		}else {
                			oauth2Provider.signedIn = false;
                			$scope.$root.isAuthenticated = oauth2Provider.signedIn;
                			$scope.$root.alertStatus = 'Algo fallo';
                			$scope.$root.rootMessages = 'Logged in with ' + resp.email;
                			$scope.$root.segundomensaje = "Algo Falla por controlador!";
                		}
                    });

                    $modalInstance.close();
                });
            });
        };
    })


.controller('listBooksCtrl',
    function ($scope, $log, Loader) {
        $scope.submitted = false;
        $scope.loading = false;
 
        //Loader.showLoading();
        
        $scope.showAllBooks = function () {
        	Loader.showLoading();
            $scope.loading = true;
            gapi.client.libreriapp.listBooks().execute(function(resp) {
            	$scope.$apply(function () {
            		if (!resp.code) {
                        resp.items = resp.items || [];
                        
                        
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
    
.controller('singleBookCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', '$rootScope', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, $rootScope, UserFactory, Loader, oauth2Provider) {

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
        
        $scope.$on('$ionicView.beforeEnter', function(){
        	$scope.listOneBook();
        });

	}
])    

.controller('venderCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', '$rootScope', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, $rootScope, UserFactory, Loader, oauth2Provider) {

		//Vender
		
		/*
	
		$scope.email = {
			"name": $state.$root.email
		};
	
		$scope.theBook = {
			"name": $state.book.name,
			"author": $state.book.author,
			"description": $state.book.description,
			"price": $state.book.price,
			"exchange": $state.book.exchange,
			"forSale": $state.book.isForSale
		};
		
		
		$scope.saveABook = function () {
	        $scope.submitted = true;
	        $scope.loading = true;
	        
	        gapi.client.libreriapp.saveBook($scope.email, $scope.theBook).execute(function(resp) {
	                if (!resp.code) {
	                        $scope.book = resp.result;
	                        $scope.$apply();
	                }else {
	                	var errorMessage = resp.error.message || '';
	                    $scope.messages = 'Error al guardar libro: ' + errorMessage;
	                    $scope.alertStatus = 'warning';
	                    $log.error($scope.messages);
	                }
	        });
	    };*/

	}
])    

.controller('BookCtrl', ['$scope', '$state', 'LSFactory', 'AuthFactory', '$rootScope', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, $rootScope, UserFactory, Loader, oauth2Provider) {

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
			if (!oauth2Provider.signedIn) {
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

.controller('CartCtrl', ['$scope', 'AuthFactory', '$rootScope', '$location', '$timeout', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, AuthFactory, $rootScope, $location, $timeout, UserFactory, Loader, oauth2Provider) {

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

		if (!oauth2Provider.signedIn) {
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

.controller('PurchasesCtrl', ['$scope', '$rootScope', 'AuthFactory', 'UserFactory', '$timeout', 'Loader', 'oauth2Provider',
	function($scope, $rootScope, AuthFactory, UserFactory, $timeout, Loader, oauth2Provider) {
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

		if (!oauth2Provider.signedIn) {
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
