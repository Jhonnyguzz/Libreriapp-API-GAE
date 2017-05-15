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
		            			$scope.falla = "Perfil salvado con exito";
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
				                        $scope.$root.urlPicture = resp.picture;
				                        	
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
    
.controller('singleBookCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {

		var myVar = $state.params.bookId;
		
		$scope.bookId = {
			"bookId": myVar
		};
		
		$scope.listOneBook = function () {
            $scope.submitted = true;
            $scope.loading = true;
            
            $scope.tmp = myVar;
            
            gapi.client.libreriapp.listOneBook($scope.bookId).execute(function(resp) {
            	$scope.$apply(function () {
                    if (!resp.code) {
                            $scope.book = resp.result;
                    }else {
                    	var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    }
            	});
            });
        };
        
        $scope.buy = function () {
            gapi.client.libreriapp.purchase($scope.bookId).execute(function(resp) {
            	$scope.$apply(function () {
                    if (!resp.code) {
                    	Loader.toggleLoadingWithMessage('Contactar a ' + resp.result.emailVendor + ' para concretar la compra',2000);
                    	$state.go('app.browse');
                    }else {
                    	Loader.toggleLoadingWithMessage('La solicitud ha sido rechazada!',2000);
                    	var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    }
            	});
            });
        };
        
        $scope.exchangeBook = function () {
        	
        	//TODO
        	$scope.exchangeTransaction = {
    			"bookId": myVar,
    			"myOfferBookId": $scope.chosenBook
    		};
        	
            gapi.client.libreriapp.exchange($scope.exchangeTransaction).execute(function(resp) {
            	$scope.$apply(function () {
                    if (!resp.code) {
                    	Loader.toggleLoadingWithMessage('Contactar a ' + resp.result.emailVendor + ' para concretar el intercambio',2000);
                    	$state.go('app.browse');
                    }else {
                    	Loader.toggleLoadingWithMessage('La solicitud ha sido rechazada!',2000);
                    	var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages);
                    }
            	});
            });
        };
        
        $scope.$on('$ionicView.beforeEnter', function(){
        	$scope.listOneBook();
        });

	}
])    

.controller('venderCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {

		//Vender
		//el email del usuario se pasa solo
	
		/*
		$scope.bookForm = {
			"name": "50 sombras de grey",
			"author": "abrams",
			"description": "El libro erotico que enloquece en el siglo 21",
			"price": 12000,
			"exchange": true,
			"forSale": true
		}; */
	
		//var bookForm = {};
		
		//bookForm.name = $scope.book.name;
		//bookForm.author = $scope.book.author;
		//bookForm.description = $scope.book.description;
		//bookForm.price = $scope.book.price;
		//bookForm.exchange = $scope.book.exchange;
		//bookForm.forSale = $scope.book.forSale;
	
		/*$scope.bookForm = {};
		
		$scope.bookForm.name = $scope.newbook.name;
		$scope.bookForm.author = $scope.newbook.author;
		$scope.bookForm.description = $scope.newbook.description;
		$scope.bookForm.price = $scope.newbook.price;
		$scope.bookForm.exchange = $scope.newbook.exchange;
		$scope.bookForm.forSale = $scope.newbook.forSale;*/

	
		$scope.saveABook = function () {
			
			//alert(this.namebook + " " + this.authorbook);
			
			$scope.bookForm = {
				"name": this.namebook,
				"author": this.authorbook,
				"description": this.descriptionbook,
				"price": this.pricebook,
				"exchange": this.exchangebook,
				"forSale": this.forSalebook
			}; 
			
	        gapi.client.libreriapp.saveBook($scope.bookForm).execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
	                        Loader.toggleLoadingWithMessage('El libro ha sido agregado!',2000);
	                        
	                        //Limpiar el formulario
	                        //this.namebook = "";
	        				//this.authorbook = "";
	        				//this.descriptionbook = "";
	        				//this.pricebook = "";
	        				//this.exchangebook = "";
	        				//this.forSalebook = "";
	                        
	                        $state.go('app.browse');
	                }else {
	                	Loader.toggleLoadingWithMessage('La solicitud ha sido rechazada!',2000);
	                }
	        	});
	        });
	    };

	}
])

.controller('mylibraryCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
	
		$scope.showMyBooks = function () {
			Loader.showLoading();
		    $scope.loading = true;
		    gapi.client.libreriapp.myBooks().execute(function(resp) {
		    	$scope.$apply(function () {
		    		if (!resp.code) {
		                resp.items = resp.items || [];
		                
		                
		                $scope.thebooks4 = [];
		                $scope.justtest = resp.items;
		                angular.forEach(resp.items, function(book) {
		                	$scope.thebooks4.push(book);
		                });
		                
		                //$scope.$apply();
		                Loader.hideLoading();
		    		}
		    	});                   
		    });
		};
		
		$scope.$on('$ionicView.beforeEnter', function(){
        	$scope.showMyBooks();
        });

	}
])

.controller('mypurchasesCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
	
		$scope.showMyPurchases = function () {
			Loader.showLoading();
		    $scope.loading = true;
		    gapi.client.libreriapp.listMyPurchases().execute(function(resp) {
		    	$scope.$apply(function () {
		    		if (!resp.code) {
		                resp.items = resp.items || [];
		                
		                
		                $scope.thebooks2 = [];
		                $scope.justtest = resp.items;
		                angular.forEach(resp.items, function(book) {
		                	$scope.thebooks2.push(book);
		                });
		                
		                //$scope.$apply();
		                Loader.hideLoading();
		    		}
		    	});                   
		    });
		};
		
		$scope.$on('$ionicView.beforeEnter', function(){
        	$scope.showMyPurchases();
        });

	}
])

.controller('myexchangesCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
	
		$scope.showMyExchanges = function () {
			Loader.showLoading();
		    $scope.loading = true;
		    gapi.client.libreriapp.listMyExchanges().execute(function(resp) {
		    	$scope.$apply(function () {
		    		if (!resp.code) {
		                resp.items = resp.items || [];
		                
		                
		                $scope.thebooks3 = [];
		                $scope.justtest = resp.items;
		                angular.forEach(resp.items, function(book) {
		                	$scope.thebooks3.push(book);
		                });
		                
		                //$scope.$apply();
		                Loader.hideLoading();
		    		}
		    	});                   
		    });
		};
		
		$scope.$on('$ionicView.beforeEnter', function(){
        	$scope.Exchanges();
        });

	}
])

.controller('transactionsCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
	
		$scope.pendingTransactions = function () {
			Loader.showLoading();
		    $scope.loading = true;
		    gapi.client.libreriapp.pendingTransactions().execute(function(resp) {
		    	$scope.$apply(function () {
		    		if (!resp.code) {
		                resp.items = resp.items || [];
		                
		                
		                $scope.thebooks7 = [];
		                $scope.justtest = resp.items;
		                angular.forEach(resp.items, function(book) {
		                	$scope.thebooks7.push(book);
		                });
		                
		                //$scope.$apply();
		                Loader.hideLoading();
		    		}
		    	});                   
		    });
		};
		
		$scope.$on('$ionicView.beforeEnter', function(){
        	$scope.pendingTransactions();
        });

	}
])

.controller('pendingpurchasesCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
	
		$scope.showUserRequestPurchase = function () {
			Loader.showLoading();
		    $scope.loading = true;
		    gapi.client.libreriapp.showUserRequestPurchase().execute(function(resp) {
		    	$scope.$apply(function () {
		    		if (!resp.code) {
		                resp.items = resp.items || [];
		                
		                
		                $scope.thebooks5 = [];
		                $scope.justtest = resp.items;
		                angular.forEach(resp.items, function(book) {
		                	$scope.thebooks5.push(book);
		                });
		                
		                //$scope.$apply();
		                Loader.hideLoading();
		    		}
		    	});                   
		    });
		};
		
		$scope.$on('$ionicView.beforeEnter', function(){
        	$scope.showUserRequestPurchase();
        });

	}
])


.controller('pendingexchangesCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
	
		$scope.showUserRequestExchange = function () {
			Loader.showLoading();
		    $scope.loading = true;
		    gapi.client.libreriapp.showUserRequestExchange().execute(function(resp) {
		    	$scope.$apply(function () {
		    		if (!resp.code) {
		                resp.items = resp.items || [];
		                
		                
		                $scope.thebooks6 = [];
		                $scope.justtest = resp.items;
		                angular.forEach(resp.items, function(book) {
		                	$scope.thebooks6.push(book);
		                });
		                
		                //$scope.$apply();
		                Loader.hideLoading();
		    		}
		    	});                   
		    });
		};
		
		$scope.$on('$ionicView.beforeEnter', function(){
	    	$scope.showUserRequestExchange();
	    });

	}
])


.controller('bookforpurchaseCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
	
		var myVar = $state.params.bookId;
		
		$scope.bookId = {
			"bookId": myVar
		};
		
		$scope.listOneBook = function () {
	        $scope.submitted = true;
	        $scope.loading = true;
	        
	        $scope.tmp = myVar;
	        
	        gapi.client.libreriapp.listOneBook($scope.bookId).execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
	                        $scope.book = resp.result;
	                }else {
	                	var errorMessage = resp.error.message || '';
	                    $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
	                    $scope.alertStatus = 'warning';
	                    $log.error($scope.messages);
	                }
	        	});
	        });
	    };
	    
	    $scope.confirm = function () {
	    	
	    	$scope.transaction = {
	    		"bookId": myVar,
	    		"confirm": true
	    	};
	    	
	        gapi.client.libreriapp.confirmPurchase($scope.transaction).execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
                        //No retorna
                		Loader.toggleLoadingWithMessage('Transferencia realizada!',2000);
                		$state.go('app.browse');
	                }else {
	                	Loader.toggleLoadingWithMessage('Error!',2000);
	                	var errorMessage = resp.error.message || '';
	                    $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
	                    $scope.alertStatus = 'warning';
	                    $log.error($scope.messages);
	                }
	        	});
	        });
	    };
	    
	    $scope.cancel = function () {  
	    	
	    	$scope.transaction = {
	    		"bookId": myVar,
	    		"confirm": false
	    	};
	    	
	        gapi.client.libreriapp.confirmPurchase($scope.transaction).execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
	                	//No retorna
                		Loader.toggleLoadingWithMessage('Transferencia cancelada!',2000);
                		$state.go('app.browse');
	                }else {
	                	Loader.toggleLoadingWithMessage('Error!',2000);
	                	var errorMessage = resp.error.message || '';
	                    $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
	                    $scope.alertStatus = 'warning';
	                    $log.error($scope.messages);
	                }
	        	});
	        });
	    };
		
		$scope.$on('$ionicView.beforeEnter', function(){
        	$scope.listOneBook();
        });

	}
])

.controller('bookforexchangeCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {
	
		var myVar = $state.params.bookId;
		
		$scope.bookId = {
			"bookId": myVar
		};
		
		$scope.listOneBook = function () {
	        $scope.submitted = true;
	        $scope.loading = true;
	        
	        $scope.tmp = myVar;
	        
	        gapi.client.libreriapp.listOneBook($scope.bookId).execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
	                        $scope.book = resp.result;
	                }else {
	                	var errorMessage = resp.error.message || '';
	                    $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
	                    $scope.alertStatus = 'warning';
	                    $log.error($scope.messages);
	                }
	        	});
	        });
	    };
	    
	    $scope.confirm = function () {
	    	
	    	$scope.transaction = {
	    		"bookId": myVar,
	    		"confirm": true
	    	};
	    	
	        gapi.client.libreriapp.confirmExchange($scope.transaction).execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
	                    //No retorna
	            		Loader.toggleLoadingWithMessage('Transferencia realizada!',2000);
	            		$state.go('app.browse');
	                }else {
	                	Loader.toggleLoadingWithMessage('Error!',2000);
	                	var errorMessage = resp.error.message || '';
	                    $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
	                    $scope.alertStatus = 'warning';
	                    $log.error($scope.messages);
	                }
	        	});
	        });
	    };
	    
	    $scope.cancel = function () {  
	    	
	    	$scope.transaction = {
	    		"bookId": myVar,
	    		"confirm": false
	    	};
	    	
	        gapi.client.libreriapp.confirmExchange($scope.transaction).execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
	                	//No retorna
	            		Loader.toggleLoadingWithMessage('Transferencia cancelada!',2000);
	            		$state.go('app.browse');
	                }else {
	                	Loader.toggleLoadingWithMessage('Error!',2000);
	                	var errorMessage = resp.error.message || '';
	                    $scope.messages = 'Failed to query the conferences created : ' + errorMessage;
	                    $scope.alertStatus = 'warning';
	                    $log.error($scope.messages);
	                }
	        	});
	        });
	    };
		
		$scope.$on('$ionicView.beforeEnter', function(){
	    	$scope.listOneBook();
	    });
	}
])


.controller('profileCtrl', ['$scope','$state', 'LSFactory', 'AuthFactory', 'UserFactory', 'Loader', 'oauth2Provider',
	function($scope, $state, LSFactory, AuthFactory, UserFactory, Loader, oauth2Provider) {

		$scope.loadProfile = function () {
	        gapi.client.libreriapp.getPerson().execute(function(resp) {
	        	$scope.$apply(function () {
	                if (!resp.code) {
	                        $scope.name = resp.result.name;
	                        $scope.email = resp.result.email;
	                        $scope.urlPicture = resp.result.urlPicture;
	                        
	                        $scope.reputation = resp.result.reputation;
	                        $scope.points = resp.result.points;
	                }else {
	                	Loader.toggleLoadingWithMessage('Se ha producido un error!',2000);
	                }
	        	});
	        });
	    };
	    
	    $scope.$on('$ionicView.beforeEnter', function(){
        	$scope.loadProfile();
        });
	}
]);
