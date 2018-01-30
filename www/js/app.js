var db = null;
angular.module('starter', ['ionic', 'starter.controllers', 'starter.factory',  'angularSoap', 'ngCordova',  'pdf', 'base64', 'utf8-base64','ngIdle'])

        .run(function ($ionicPlatform, $state, $rootScope, $location, $http, $cordovaSQLite, $ionicPopup, $window, $cordovaDialogs, Idle) {
            $rootScope.httpErrorReport = function (data, status, headers, config) {
                //alert('Need to send an email');
                $cordovaDialogs.prompt('Error Report', 'Error', ['OK', 'Cancel'], 'Do you want to report error to MCP')
                        .then(function (result) {
                            var input = result.input1;
                            // no button = 0, 'OK' = 1, 'Cancel' = 2
                            var btnIndex = result.buttonIndex;
                        });
            }


            $rootScope.$on('$stateChangeStart', function () {
//                if ($rootScope.online === true) { 
//                } else { 
//                    $cordovaDialogs.alert('Sorry, no Internet connectivity detected. Please reconnect and try again.', 'No Internet Connection', 'OK');
//                }
                var countSql = "SELECT count(*) AS cnt FROM cart";
                $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                    $rootScope.cartLength = res.rows.item(0).cnt;
                });

            })
           Idle.watch();
            $rootScope.$on('IdleTimeout', function () {
                // end their session and redirect to login.
               // alert('IDLE');
               // alert("here in the state go");
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                $rootScope.customerId = "";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                //   $state.go('/sign-in');
                navigator.app.exitApp();

            });
            $rootScope.online = navigator.onLine;
            $window.addEventListener("offline", function () {
                $rootScope.$apply(function () {
                    $rootScope.online = false;
                });
            }, false);
            $window.addEventListener("online", function () {
                $rootScope.$apply(function () {
                    $rootScope.online = true;
                });
            }, false);
         
            $http.defaults.headers.put['Content-Type'] = 'application/json';

            $ionicPlatform.registerBackButtonAction(function (event) {
                if ($state.current.name == "tab.home") {
                    navigator.app.exitApp();
                } else {
                    navigator.app.backHistory();
                }
            }, 100);
            $ionicPlatform.ready(function () {
              if (window.cordova) {
                    db = $cordovaSQLite.openDB({name: "app.db", bgType: 1, location: 1});
                } else {
                    db = window.sqlitePlugin.openDatabase("app.db", '1', 'ES Database', 5 * 1024 * 1024);
                }

                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS cart (id integer primary key autoincrement, tnsBU text,tnsCustID text,tnsCust_Name text,tnsItem_Desc text,tnsItem_Id text,tnsItem_Name text,tnsItem_Type text,tnsTank text,tnsTanksize text,tnsUOM text,tnsQuantity text,tnsStore text, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)").then(
                        function (success) {
                            console.log("created the databse qq app config");
                        },
                        function (error) {
                            console.log(' error in open database', 'creating/opening the database', error);
                        }

                );

                var countSql = "SELECT count(*) AS cnt FROM cart";
                $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                    $rootScope.cartLength = res.rows.item(0).cnt;
                    console.log("the cart from congif length" + res.rows.item(0).cnt);
                });

                var then = window.localStorage.getItem("AssignedDate");
                var now = new Date();
                var a = moment(then);
                var b = moment(now);

                var years = a.diff(b, 'years');
                var months = a.diff(b, 'months') % 12;
                var days = a.diff(b, 'days');
                var hours = a.diff(b, 'hours');
                var min = a.diff(b, 'minutes');
// alert(" from config the difference years" + years + 'months' + months + 'days' + days+'hours'+hours+'min'+min);
//            alert("then and now"+then+now);

                if (hours > 3) {
                    var emptyDb = "DELETE FROM cart";
                    $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                        console.log("the detele response" + JSON.stringify(res));

                    });
                }
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
// org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider,IdleProvider,KeepaliveProvider) {
            $ionicConfigProvider.tabs.position('bottom');
  IdleProvider.idle(600);
  IdleProvider.timeout(600);
  KeepaliveProvider.interval(10); // 

            $stateProvider
                    .state('loader', {
                        cache: false,
                        url: '/loader',
                        templateUrl: 'templates/loader.html',
                        controller: 'LoaderInCtrl'
                    })
                    .state('signin', {
                        cache: false,
                        url: '/sign-in',
                        templateUrl: 'templates/sign-in.html',
                        controller: 'SignInCtrl'
                    })
                    .state('signup', {
                        url: '/sign-up',
                        templateUrl: 'templates/sign-up.html',
                        controller: 'SignUpCtrl'
                    })
                    .state('forgotpassword', {
                        url: '/forgot-password',
                        templateUrl: 'templates/forgot-password.html',
                        controller: 'passwordCtrl'
                    })
                    .state('logout', {
                        url: '/logout',
                        templateUrl: 'templates/logout.html',
                        controller: 'logoutCtrl'
                    })
// setup an abstract state for the tabs directive
                    .state('tab', {
                        url: '/tab',
                        abstract: true,
                        templateUrl: 'templates/tabs.html',
                        controller: 'tabsCtrl'
                    })

                    .state('tab.home', {
                        url: '/home',
                        views: {
                            'tab-home': {
                                templateUrl: 'templates/tab-home.html',
                                controller: 'HomeCtrl'
                            }
                        }
                    })

                    .state('tab.orders', {
                        url: '/orders',
                        views: {
                            'tab-orders': {
                                templateUrl: 'templates/tab-orders.html',
                                controller: 'OrdersCtrl'
                            }
                        }
                    })
                    .state('tab.chat-detail', {
                        url: '/orders/:chatId',
                        views: {
                            'tab-orders': {
                                templateUrl: 'templates/chat-detail.html',
                                controller: 'ChatDetailCtrl'
                            }
                        }
                    })
                    .state('tab.invoices', {
                        url: '/invoices',
                        views: {
                            'tab-invoices': {
                                templateUrl: 'templates/tab-invoices.html',
                                controller: 'InvoicesCtrl'
                            }
                        }
                    })
                    .state('tab.sds', {
                        url: '/sds',
                        views: {
                            'tab-sds': {
                                templateUrl: 'templates/tab-sds.html',
                                controller: 'SdsCtrl'
                            }
                        }
                    })
                    .state('tab.contact', {
                        url: '/contact',
                        views: {
                            'tab-contact': {
                                templateUrl: 'templates/tab-contact.html',
                                controller: 'ContactCtrl'
                            }
                        }
                    })
                    .state('tab.logout', {
                        url: '/logout',
                        views: {
                            'tab-logout': {
                                templateUrl: 'templates/tab-logout.html',
                                controller: 'logoutCtrl'
                            }
                        }
                    })
                    .state('products', {
                        url: '/products',
                        templateUrl: 'templates/products.html',
                        controller: 'ProductsCtrl'

                    })
                    .state('cart', {
                        url: '/cart',
                        templateUrl: 'templates/cart.html',
                        controller: 'cartCtrl'

                    })
                    .state('invoice', {
                        url: '/invoice',
                        templateUrl: 'templates/invoice.html',
                        controller: 'invoiceCtrl'

                    })
                    .state('tab.eta', {
                        url: '/eta',
                        views: {
                            'tab-eta': {
                                templateUrl: 'templates/tab-eta.html',
                                controller: 'EtaCtrl'
                            }
                        }
                    });

            $urlRouterProvider.otherwise('/loader');

        });
