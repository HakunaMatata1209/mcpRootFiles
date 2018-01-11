angular.module('starter.controllers', [])
        .controller('LoaderInCtrl', function ($scope, $state, $cordovaToast, services, $rootScope, $location, $ionicLoading, $cordovaSQLite) {
            $scope.$on('$ionicView.enter', function () {
                var logginSessoin = window.localStorage.getItem("email");
                if (logginSessoin && logginSessoin !== "null") {
                    $rootScope.customerId = window.localStorage.getItem("customerIdLocal");
                    $state.go('tab.home', {
                        reload: true
                    });
                } else {
                    $location.path('/sign-in');
                }
            });
            $scope.forgotNavigation = function () {
                $location.path('/forgot-password');
            }
            $scope.signUpNavigation = function () {
                $location.path('/sign-up');
            }
        })
        .controller('SignInCtrl', function ($scope, $state, $cordovaToast, services, $rootScope, $location, $ionicLoading) {

            $scope.$on('$ionicView.enter', function () {

                $scope.signIn = function (username, password) {
                    $ionicLoading.show({
                        templateUrl: "templates/loading.html",
                        noBackdrop: false
                    });
                    var passwordSha1 = CryptoJS.SHA1(password).toString();
                    services.loginUser(username, passwordSha1).then(function mySuccess(response) {
                        console.log(response);
                        if (response["tns:custid"] == null) {
                            $ionicLoading.hide();
                            $cordovaToast.showShortCenter('Enter valid credentials').then(function (success) {
// success
                            }, function (error) {
// error
                            });

                        } else {
                            $ionicLoading.hide();
                            $rootScope.customerId = response["tns:custid"];
                            window.localStorage.setItem("customerIdLocal", $rootScope.customerId);
                            window.localStorage.setItem("logkey", response["tns:custid"]);
                            window.localStorage.setItem("custid", response["tns:custid"]);
                            window.localStorage.setItem("email", response["tns:email"]);
                            window.localStorage.setItem("userName", response["tns:userName"]);
                            window.localStorage.setItem("uin", response["tns:uin"]);
                            window.localStorage.setItem("status", response["tns:status"]);
                            $cordovaToast.showShortCenter('Logged-In Successfully').then(function (success) {
                                $state.go('tab.home', {
                                    reload: true
                                });
                            }, function (error) {
// error
                            });

                        }

                    }, function myError(response) {
                        console.log('in error');

                        $cordovaToast.showShortCenter('Error with network').then(function (success) {
// success
                        }, function (error) {
// error
                        });
                    });

                };

            });

            $scope.forgotNavigation = function () {
                $location.path('/forgot-password');
            }
            $scope.signUpNavigation = function () {
                $location.path('/sign-up');
            }
        })
        .controller('SignUpCtrl', function ($scope, $state, $location, services, $cordovaToast) {
            $scope.forgotNavigation = function () {
                $location.path('/forgot-password');
            };
            $scope.signInNavigation = function () {
                $location.path('/sign-in');
            };
            $scope.signUp = function (userEmail) {
                services.registration(userEmail).then(function mySuccess(response) {
                    console.log(response);
                    if (response.result === "User Created Successfully") {
                        $cordovaToast.showShortCenter(response.result).then(function (success) {
                            $location.path('/sign-in');
                        }, function (error) {
// error
                        });

                    } else {
                        $cordovaToast.showShortCenter(response.result).then(function (success) {
// success
                        }, function (error) {
// error
                        });
                    }

                }, function myError(response) {
                    console.log('in error');
                });

            };

        })
        .controller('passwordCtrl', function ($scope, $rootScope, $state, $location, services, $cordovaToast) {
            $scope.signInNavigation = function () {
                $location.path('/sign-in');
            };

            $scope.signUpNavigation = function () {
                $location.path('/sign-up');
            }
            $scope.forgotPassword = function (email, uin) {
                services.forgotPassword(email, uin).then(function mySuccess(response) {
                    if (response.result == "Sucess") {
                        $cordovaToast.showShortCenter('Email has been sent').then(function (success) {
                            $location.path('/sign-in');
                        }, function (error) {
// error
                        });
                    } else {
                        $cordovaToast.showShortCenter('Error in sending email try again!').then(function (success) {
                            $location.path('/sign-in');
                        }, function (error) {
// error
                        });
                    }
                }, function myError(response) {
                    console.log('in error');


                });
            }

        })
        .controller('HomeCtrl', function ($scope, services, $state, $http, $rootScope, $location, $window, $cordovaSQLite, $ionicLoading, $cordovaToast) {

            $scope.$on('$ionicView.enter', function () {

                $ionicLoading.show({
                    templateUrl: "templates/loading.html",
                    noBackdrop: false
                });

                services.addressDetails(window.localStorage.getItem("email")).then(function mySuccess(response) {

                    $scope.stores = response["tns:AddressNumberOutput"];
                    var i;
                    if ($scope.stores.length) {
                        var arrayObj = $scope.stores;
                    } else {
                        var arr = [];
                        arr.push($scope.stores);
                        var arrayObj = arr;
                    }

                    for (i = 0; i < arrayObj.length; i++) {

                        arrayObj[i].tnsAddressLine1 = arrayObj[i]['tns:AddressLine1'];
                        arrayObj[i].tnsAddressNumber = arrayObj[i]['tns:AddressNumber'];
                        arrayObj[i].tnsCity = arrayObj[i]['tns:City'];
                        arrayObj[i].tnsPostal_Code = arrayObj[i]['tns:Postal_Code'];
                        arrayObj[i].tnsState = arrayObj[i]['tns:State'];
                        arrayObj[i].tnsAddressName = arrayObj[i]['tns:AddressName'];
                        delete arrayObj[i]['tns:AddressLine1'];
                        delete arrayObj[i]['tns:AddressNumber'];
                        delete arrayObj[i]['tns:City'];
                        delete arrayObj[i]['tns:Postal_Code'];
                        delete arrayObj[i]['tns:State'];
                        delete arrayObj[i]['tns:AddressName'];
                    }
                    $ionicLoading.hide();
                    $scope.storeResponse = arrayObj;
                }, function myError(response) {
                    console.log('in error');
                    $ionicLoading.hide();
                });

            });
            $scope.orderLUB2 = function () {
                services.orderLUB().then(function mySuccess(response) {}, function myError(response) {
                    console.log('in error error orderLUB');
                });
            }

            $scope.clearSearchString = function () {
                $scope.search = "";
            }
            $scope.customerDetails = $rootScope.customerId;
            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";


                $location.path('/sign-in');
            };
            $scope.cartLogo = function (logoCount) {
                if (logoCount) {

                    $location.path('/cart');
                } else {
                    $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                    }, function (error) {
// error
                    });
                }
            }
            $scope.locationnumber = function () {
                services.sample11().then(function mySuccess(response) {}, function myError(response) {
                    console.log('Error in services.sample11');
                });
            }
            $scope.orderFuel1 = function () {
                services.orderFuel().then(function mySuccess(response) {}, function myError(response) {
                    console.log('error in services.orderFuel');
                });
            }

            $scope.etabasedonordernumber = function () {
                services.ETAonOrderNum().then(function mySuccess(response) {}, function myError(response) {
                    console.log('in error');
                });
            }
            $scope.pdfbyordernumber = function () {
                services.PDFonOrderNum().then(function mySuccess(response) {}, function myError(response) {
                    console.log('error in  services.PDFonOrderNum');
                });
            }

            $scope.moreInfo = function (store) {
                window.localStorage.setItem('selectedStore', store);
                window.localStorage.setItem('selectedStoreAddress', store.tnsAddressNumber);

                $location.path('/products');

            };

        })
        .controller('tabsCtrl', function ($scope, $rootScope, $state, $location, $window, services) {})
        .controller('OrdersCtrl', function ($scope, services, $ionicActionSheet, $cordovaToast, $rootScope, $cordovaSQLite, $location, base64, $window, $ionicLoading, NgTableParams, $cordovaFile, $base64, $cordovaDialogs, $ionicModal, $cordovaFileOpener2, $filter) {

            $scope.$on('$ionicView.enter', function () {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html",
                    noBackdrop: false
                });
                $scope.cartLogo = function (logoCount) {
                    if (logoCount) {

                        $location.path('/cart');
                    } else {
                        $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                        }, function (error) {
// error
                        });
                    }
                }
                services.customerOrders(window.localStorage.getItem("custid")).then(function mySuccess(response) {
                    $scope.orders = response;
                    $scope.showHeader = true;
                    $scope.shownullmessage = false;

                    var i;
                    if (response == null) {
                        $scope.showHeader = false;
                        $scope.shownullmessage = true;
                        $ionicLoading.hide();
                        $scope.orders = [{}];
                    } else {
                        $scope.showHeader = true;
                        $scope.shownullmessage = false;
                        var arrayObj = response["tns:Response"];
                        for (i = 0; i < arrayObj.length; i++) {

                            arrayObj[i].tnsOrderType = arrayObj[i]['tns:OrderType'];
                            arrayObj[i].tnsOrder_Invoice = arrayObj[i]['tns:Order_Invoice'];
                            arrayObj[i].tnsItem_Number = arrayObj[i]['tns:Item_Number'];
                            arrayObj[i].tnsItem_Name = arrayObj[i]['tns:Item_Name'];
                            arrayObj[i].tnsDate_Ordered = arrayObj[i]['tns:Date_Ordered'];
                            arrayObj[i].tnsTransaction_Qty = arrayObj[i]['tns:Transaction_Qty'];

                            arrayObj[i].tnsOrderType = arrayObj[i]['tns:OrderType'];
                            arrayObj[i].tnsDate_requested = arrayObj[i]['tns:Date_requested'];
                            arrayObj[i].tnsDate_scheduled = arrayObj[i]['tns:Date_scheduled'];
                            arrayObj[i].tnsUnit_Of_Mes = arrayObj[i]['tns:Unit_Of_Mes'];
                            arrayObj[i].tnsPrice_Per_Unit = arrayObj[i]['tns:Price_Per_Unit'];
                            arrayObj[i].tnsList_Price = arrayObj[i]['tns:List_Price'];

                            delete arrayObj[i]['tns:Order_Invoice'];
                            delete arrayObj[i]['tns:Item_Number'];
                            delete arrayObj[i]['tns:Item_Name'];
                            delete arrayObj[i]['tns:Date_Ordered'];
                            delete arrayObj[i]['tns:Transaction_Qty'];

                            delete arrayObj[i]['tns:OrderType'];
                            delete arrayObj[i]['tns:Date_requested'];
                            delete arrayObj[i]['tns:Date_scheduled'];
                            delete arrayObj[i]['tns:Unit_Of_Mes'];
                            delete arrayObj[i]['tns:Price_Per_Unit'];
                            delete arrayObj[i]['tns:List_Price'];
                        }
                        $ionicLoading.hide();
                        // $scope.orders = arrayObj;

                        $scope.orders = [];

                        angular.forEach(arrayObj, function (value, key) {
                            var exists = false;
                            angular.forEach($scope.orders, function (val2, key) {
                                if (angular.equals(value.tnsOrder_Invoice, val2.tnsOrder_Invoice)) {
                                    exists = true
                                }
                                ;
                            });
                            if (exists == false && value.tnsOrder_Invoice != "") {
                                $scope.orders.push(value);
                            }
                        });
                        //  console.log('orders' + JSON.stringify(arrayObj));
                    }


                }, function myError(response) {
                    console.log(' error in   services.customerOrders');
                    $ionicLoading.hide();

                })



            });

            $scope.logoutHome = function () {
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                $location.path('/sign-in');

            };
            $scope.propertyName = 'tnsDate_Ordered';
            $scope.reverse = false; 
            $rootScope.orderbyelement ="-";
            $scope.sortBy = function (propertyName,orderbyelement) {
             //  alert("the order element"+orderbyelement);
              //  alert($scope.reverse);
                if(orderbyelement === '-'){
                 //   alert("the value is true");
                       $rootScope.orderbyelement="+";
                } 
                
                   if(orderbyelement === '+'){
                 //   alert("the value is true");
                       $rootScope.orderbyelement="+";
                } 
                 
              
               
               $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : true;
                $scope.propertyName = propertyName;
            };

            $scope.sort = function (keyname) {
                $scope.sortKey = keyname; //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            }
            $scope.showActionsheet = function (index, selectedInvoice) {

                $ionicModal.fromTemplateUrl('templates/myModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.modal = modal;
                });
                $scope.closeModal = function () {
                    $scope.modal.hide();
                }

                $ionicActionSheet.show({
                    titleText: '<p class="cartHeaders font-bold" style="color:black !important;"> More Information About Order </p>',
                    buttons: [

                        {
                            text: '<i class="icon ion-clock"></i> Eta'
                        },
                        {
                            text: '<i class="icon ion-folder"></i> Pod'
                        },
                        {
                            text: '<i class="icon ion-eye"></i> View details'
                        }
                    ],
                    destructiveText: 'Cancel',
                    cancelText: 'Cancel',
                    cancel: function () {},
                    buttonClicked: function (index1) {
                        if (index1 == "0") {
                            services.etaDetails(selectedInvoice.tnsOrder_Invoice).then(function mySuccess(response) {
                                var x2js = new X2JS();
                                var aftCnv = x2js.xml_str2json(response.Messageresult);
                                var etapackage = aftCnv.Data;
                                if (etapackage.Package) {
                                    $cordovaDialogs.alert('Eta Not Planned', 'Eta Details', 'OK');
//          .then(function() {
//          // callback success
//              });
                                } else {
                                    $cordovaDialogs.alert('Eta Not Planned', 'Eta Details', 'OK');
                                }
                            }, function myError(response) {
                                console.log("error in  $scope.eta");

                            });

                        } else if (index1 == "1") {
                            services.PDFonOrderNum(selectedInvoice.tnsOrder_Invoice).then(function mySuccess(response) {
                                console.log(response);
                                var myBase64 = response['tns:result'];
                                var contentType = "application/pdf";
                                var folderpath = cordova.file.externalRootDirectory;
                                var filename = selectedInvoice.tnsOrder_Invoice + ".pdf";

                                function b64toBlob(b64Data, contentType, sliceSize) {
                                    contentType = contentType || '';
                                    sliceSize = sliceSize || 512;
                                    var byteCharacters = atob(b64Data);
                                    var byteArrays = [];
                                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                                        var byteNumbers = new Array(slice.length);
                                        for (var i = 0; i < slice.length; i++) {
                                            byteNumbers[i] = slice.charCodeAt(i);
                                        }

                                        var byteArray = new Uint8Array(byteNumbers);

                                        byteArrays.push(byteArray);
                                    }

                                    var blob = new Blob(byteArrays, {
                                        type: contentType
                                    });
                                    return blob;
                                }

                                function savebase64AsPDF(folderpath, filename, content, contentType) {
                                    var DataBlob = b64toBlob(content, contentType);
                                    var location = folderpath + filename;
                                    console.log('the location' + location);
                                    console.log("Starting to write the file :3");

                                    window.resolveLocalFileSystemURL(folderpath, function (dir) {
                                        dir.getFile(filename, {
                                            create: true
                                        }, function (file) {
                                            file.createWriter(function (fileWriter) {
                                                fileWriter.write(DataBlob);
                                                $cordovaFileOpener2.open(location, 'application/pdf').then(function () {
//alert("file opened successfully");
                                                }, function (err) {
                                                    alert("An error occurred.");
                                                });
//window.open(encodeURI(location), '_system');
                                            }, function () {
                                                console.log('Unable to save file in path ' + folderpath);
                                            });
                                        });
                                    });
                                }
                                savebase64AsPDF(folderpath, filename, myBase64, contentType);

                            }, function myError(response) {
                                console.log('error in  services.PDFonOrderNum');
                            });
                        } else {

                            $scope.selectedInvoiceData = selectedInvoice;
                            $scope.modal.show();
                        }
                        return true;
                    },
                    destructiveButtonClicked: function () {
                        return true;
                    }
                });
            };


        })

        .controller('cartCtrl', function ($scope, $ionicPopup, $state, $rootScope, $cordovaSQLite, $cordovaDialogs, $location, $cordovaToast, services, $ionicLoading) { // define $ionicPopup here
            $rootScope.cartDisableButton = false;
             
            $scope.submitForm = function (form) {
                if (form.$valid) {
                    // alert("valid");
                    $rootScope.cartDisableButton = false;
                } else {
                    //   alert("not valid");
                    $rootScope.cartDisableButton = true;
                }
            };
            $scope.$on('$ionicView.enter', function () {
                $scope.orderInstruction="";
                $scope.orderInstructionPo="";
                $scope.orderInstructionEmail="";
                var then = window.localStorage.getItem("AssignedDate");
                var now = new Date();
                var a = moment(then);
                var b = moment(now);

                var years = a.diff(b, 'years');
                var months = a.diff(b, 'months') % 12;
                var days = a.diff(b, 'days');
                var hours = a.diff(b, 'hours');
                var min = a.diff(b, 'minutes');

                console.log(" from controller the difference years" + years + 'months' + months + 'days' + days + 'hours' + hours + 'min' + min);


                var countSql = "SELECT count(*) AS cnt FROM cart";
                $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                    $rootScope.cartLength = res.rows.item(0).cnt;
                    console.log("the cart length" + $rootScope.cartLength);
                    console.log("the count result" + JSON.stringify(res));
                });
                var selectRecords = "SELECT * FROM cart";
                $rootScope.cartItems_one = [];
                $cordovaSQLite.execute(db, selectRecords, []).then(function (res) {
                    if (res.rows.length > 0) {
                        console.log("SELECTED -> " + res.rows.item(0).tnsItem_Id);
                        for (var i = 0; i < res.rows.length; i++) {
                            $rootScope.cartItems_one.push({
                                tnsBU: res.rows.item(i).tnsBU,
                                tnsCustID: res.rows.item(i).tnsCustID,
                                tnsCust_Name: res.rows.item(i).tnsCust_Name,
                                tnsItem_Desc: res.rows.item(i).tnsItem_Desc,
                                tnsItem_Id: res.rows.item(i).tnsItem_Id,
                                tnsItem_Name: res.rows.item(i).tnsItem_Name,
                                tnsItem_Type: res.rows.item(i).tnsItem_Type,
                                tnsTank: res.rows.item(i).tnsTank,
                                tnsTanksize: res.rows.item(i).tnsTanksize,
                                tnsUOM: res.rows.item(i).tnsUOM,
                                tnsQuantity: res.rows.item(i).tnsQuantity,
                                tnsStore: res.rows.item(i).tnsStore
                            });

                        }
                    } else {
                        console.log("No results found");
                    }

                });


            });

            $scope.gotoProducts = function () {
                if ($rootScope.cartLength) {
                    $cordovaDialogs.confirm('Cart will be empty', 'Cart Empty', ['OK', 'Cancel'])
                            .then(function (buttonIndex) {
                                var btnIndex = buttonIndex;
                                if (btnIndex == "1") {
                                    $rootScope.cartLength = 0;
                                    var emptyDb = "DELETE FROM cart";
                                    $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                                        console.log("the detele response" + JSON.stringify(res));

                                    });

                                    $location.path('/products');
                                } else if (btnIndex == "2") {

                                    $location.path('/products');
                                } else {

                                }
// no button = 0, 'OK' = 1, 'Cancel' = 2
                            });
                } else {
                    $location.path('/products');
                }
            }

            $scope.checkoutProductQuantity = function (tnsQuantity, tnsItem_Id, tnsTanksize, index) {
                if (tnsQuantity) {
                    var queryupdate = "UPDATE cart SET tnsQuantity = ? WHERE tnsItem_Id = ?";
                    $cordovaSQLite.execute(db, queryupdate, [tnsQuantity, tnsItem_Id]).then(function (res) {
                        console.log("updated successfully if: " + res.insertId);
                    }, function (err) {
                        console.log("error in updating in error if " + JSON.stringify(err));
                    });
                }


            }

            $scope.removeFromCart = function (index, tnsItem_Id) {
                $cordovaDialogs.confirm('Product Will Be deleted from the cart', 'Delete', ['OK', 'Cancel'])
                        .then(function (buttonIndex) {
                            var btnIndex = buttonIndex;
                            if (btnIndex == "1") {
                                $rootScope.cartItems_one.splice(index, 1);
                                var emptyDb = "DELETE FROM cart Where tnsItem_Id=? ";
                                $cordovaSQLite.execute(db, emptyDb, [tnsItem_Id]).then(function (res) {
                                    console.log("the detele response" + JSON.stringify(res));

                                });

                                var countSql = "SELECT count(*) AS cnt FROM cart";
                                $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                                    $rootScope.cartLength = res.rows.item(0).cnt;
                                });

                            }
// no button = 0, 'OK' = 1, 'Cancel' = 2
                        });
// $scope.cartproducts.splice(index, 1);
            };
            $scope.continueShopping = function () {
                $state.go('tab.home');
            }


            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                $location.path('/sign-in');
            };

            $scope.checkout = function (infodata) {
                $scope.cartError = false;
                $scope.cartErrorDisable = false;
                $ionicLoading.show({
                    templateUrl: "templates/loading.html",
                    noBackdrop: false
                });
                var cartObject = [];
                $cordovaDialogs.confirm('Confirm Checkout', 'Checkout', ['OK', 'Cancel'])
                        .then(function (buttonIndex) {
                            var btnIndex = buttonIndex;
                            if (btnIndex == "1") {
                                if ($rootScope.cartItems_one.length) {
                                    angular.forEach($rootScope.cartItems_one, function (value, key) {
                                        console.log("key  and value" + value.tnsQuantity + 'for' + value.tnsItem_Id);
                                        if (value.tnsQuantity === null) {
                                            $scope.cartError = true;
                                            $scope.cartErrorData = "Quanity is empty for " + value.tnsItem_Id;
                                            $scope.cartErrorDisable = true;
                                        } else {
                                            $scope.cartError = false;
                                            $scope.cartErrorDisable = false;
                                            var objectIndex = key + 1 + '.000';
                                            cartObject.push({
                                                COrderIdentifier: "V",
                                                jdeOrderline: objectIndex,
                                                item_Desc: value.tnsItem_Desc,
                                                Item_Id: value.tnsItem_Id,
                                                businessUnit: value.tnsBU,
                                                jdeCompany: "00010",
                                                jdeShipTo: value.tnsCustID,
                                                jdeOrderType: "SO",
                                                netGallonsOrdered: value.tnsQuantity,
                                                productCode: value.tnsItem_Name,
                                                szReqDeliDtStartString: $rootScope.changedDateCart + $rootScope.startTimeCart,
                                                szReqDeliDtEndString: $rootScope.changedDateCart + $rootScope.endTimeCart
                                            });
                                        }

                                    });

                                    if (cartObject.length) {
                                        services.placeCart(cartObject).then(function mySuccess(response) {
                                            var x2js = new X2JS();
                                            var aftCnv = x2js.xml_str2json(response.data);
                                            var orderResponse = aftCnv.Envelope.Body.processResponse.outputVO;
                                           // alert("the order response is"+JSON.stringify(orderResponse));
                                               //alert("the order invoice number is check next"+JSON.stringify(orderResponse.documentOrderNoInvoiceetc));
                                              var checkisArray=(angular.isArray(orderResponse));
                                              if(checkisArray == true){ 
                                                   var orderDocumentOrderNoInvoiceetc=orderResponse[0].documentOrderNoInvoiceetc;
                                              }else{ 
                                                    var orderDocumentOrderNoInvoiceetc = orderResponse.documentOrderNoInvoiceetc;
                                              }
                                              
                                            if (orderResponse) {
                                                $rootScope.cartLength = "";
                                                var emptyDb = "DELETE FROM cart";
                                                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                                                    console.log("the delete" + res);
                                                });
                                                $ionicLoading.hide();
                                                $cordovaDialogs.alert('Order has been placed sucessfully, Your invoice number is ' + orderDocumentOrderNoInvoiceetc, 'Order Status', 'OK');
                                                if (infodata) {
                                                    services.deliveryInstruction(JSON.parse(orderDocumentOrderNoInvoiceetc), infodata.orderInstruction, infodata.orderInstructionEmail).then(function mySuccess(response) {
                                                        console.log("succes in  $scope.delivery instruction" + response);
                                                    }, function myError(response) {
                                                        console.log("error in  $scope.delivery instruction");
                                                    });
                                                } else {
                                                }
                                                $ionicLoading.hide();
                                                $state.go('tab.home');
                                            } else {
                                                $ionicLoading.hide();
                                                $cordovaDialogs.alert('Error in placing order , Please try again!', 'Order Status', 'OK');
                                                $state.go('tab.home');
                                            }
                                        }, function myError(response) {
                                            $ionicLoading.hide();
                                            $cordovaDialogs.alert('Error in placing order', 'Order Status', 'OK');

                                        });
                                    }

                                } else {
                                    $ionicLoading.hide();
                                    alert("cannot checkout ,cart has empty items");
                                }
                            } //button canel case
// no button = 0, 'OK' = 1, 'Cancel' = 2
                            $ionicLoading.hide();
                        });
//                    }else{
//                        alert("Cannot checkout please the the quantity of the product");
//                        
//            }

                $ionicLoading.hide();
            }

        })

        .controller('InvoicesCtrl', function ($scope, $location, $window, services, $cordovaToast, $ionicLoading, $rootScope, $cordovaSQLite) {

            $scope.$on('$ionicView.enter', function () {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html",
                    noBackdrop: false
                });
                $scope.cartLogo = function (logoCount) {
                    if (logoCount) {

                        $location.path('/cart');
                    } else {
                        $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                        }, function (error) {
// error
                        });
                    }
                }
                services.getInvoiceDetails(window.localStorage.getItem("custid")).then(function mySuccess(response) {

                    $scope.invoicesData = true;
                    $scope.shownullmessageInvoices = false;
                    if (response == null) {

                        $scope.shownullmessageInvoices = true;
                        $scope.invoicesData = false;


                    } else {
                        $scope.invoiceDetails = response["tns:result"];
                        $scope.invoicesData = true;
                        $scope.shownullmessageInvoices = false;
                        var i;
                        if ($scope.invoiceDetails.length) {
                            var arrayObj = $scope.invoiceDetails;
                        } else {
                            var arr = [];
                            arr.push($scope.invoiceDetails);
                            var arrayObj = arr;
                        }
                        for (i = 0; i < arrayObj.length; i++) {
                            arrayObj[i].tnsAddress_Number = arrayObj[i]['tns:Address_Number'];
                            arrayObj[i].tnsDate_Delivery = arrayObj[i]['tns:Date_Delivery '];
                            arrayObj[i].tnsDate_Invoice = arrayObj[i]['tns:Date_Invoice'];
                            arrayObj[i].tnsDate_Ordered = arrayObj[i]['tns:Date_Ordered '];
                            arrayObj[i].tnsDate_Promissed = arrayObj[i]['tns:Date_Promissed '];

                            arrayObj[i].tnsDate_requested = arrayObj[i]['tns:Date_requested'];
                            arrayObj[i].tnsDesc = arrayObj[i]['tns:Desc'];
                            arrayObj[i].tnsItem_Number = arrayObj[i]['tns:Item_Number'];
                            arrayObj[i].tnsList_Price = arrayObj[i]['tns:List_Price'];
                            arrayObj[i].tnsOrder_Invoice = arrayObj[i]['tns:Order_Invoice'];

                            arrayObj[i].tnsOrder_Number = arrayObj[i]['tns:Order_Number'];
                            arrayObj[i].tnsOrder_type = arrayObj[i]['tns:Order_type'];
                            arrayObj[i].tnsPrice_Per_Unit = arrayObj[i]['tns:Price_Per_Unit'];
                            arrayObj[i].tnsTransaction_Qty = arrayObj[i]['tns:Transaction_Qty'];
                            arrayObj[i].tnsUnit_Of_Mes = arrayObj[i]['tns:Unit_Of_Mes'];

                            delete arrayObj[i]['tns:Address_Number'];
                            delete arrayObj[i]['tns:Date_Delivery'];
                            delete arrayObj[i]['tns:Date_Invoice'];
                            delete arrayObj[i]['tns:Date_Ordered'];
                            delete arrayObj[i]['tns:Date_Promissed'];

                            delete arrayObj[i]['tns:Date_requested'];
                            delete arrayObj[i]['tns:Desc'];
                            delete arrayObj[i]['tns:Item_Number'];
                            delete arrayObj[i]['tns:List_Price'];
                            delete arrayObj[i]['tns:Order_Invoice'];

                            delete arrayObj[i]['tns:Order_Number'];
                            delete arrayObj[i]['tns:Order_type'];
                            delete arrayObj[i]['tns:Price_Per_Unit'];
                            delete arrayObj[i]['tns:Transaction_Qty'];
                            delete arrayObj[i]['tns:Unit_Of_Mes'];
                        }
                    }

                    $ionicLoading.hide();
                    $scope.invoices = arrayObj;
                    console.log('orders' + JSON.stringify(arrayObj));
                }, function myError(response) {
                    console.log('in error');
                    $ionicLoading.hide();
                });




            });

            $scope.invoiceFullDetails = function (invoiceNumber) {
                $window.localStorage.setItem("addressNumber", invoiceNumber.tnsAddress_Number);
                $window.localStorage.setItem("invoiceNumber", invoiceNumber.tnsOrder_Invoice);
                $location.path('/invoice');

            };
            $scope.clearSearchString = function () {
                $scope.search = "";
            }
            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                $location.path('/sign-in');
            };

        })
        .controller('ProductsCtrl', function ($scope, $state, services, $location, $cordovaToast, $ionicLoading, $rootScope, $window, $cordovaDialogs, $cordovaSQLite) {

            $scope.goToCartButton = true;
            var ordertype;
            var dateSelected;
            var timeSelected;
            $scope.selectedDate = "";
            $scope.selectedTime = "";
            var dateCurrent = new Date();
            $scope.tomorrow = new Date();
            var tomorrowsDate = $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);
            dateCurrent.setDate(dateCurrent.getDate() + 1);
            $scope.minDate = tomorrowsDate;
            $scope.$on('$ionicView.enter', function () {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html",
                    noBackdrop: false
                });
                $scope.selectedDate = "";
                $scope.selectedTime = "";
                $scope.isDisabled = true;
                $scope.date = "";
                $scope.time = "";
                var d = new Date();
                console.log(d);
                d.setDate(d.getDate() + 1);
                console.log(d);
                console.log(d.getDate());
                $scope.tomorrowsDate = d.getDate;
                services.addressProducts(window.localStorage.getItem('selectedStoreAddress')).then(function mySuccess(response) {
                    $scope.itemsOutput = response["tns:ItemsOutput"];
                    console.log(response["tns:ItemsOutput"]);
                    var i;
                    if ($scope.itemsOutput.length) {
                        var arrayObj = $scope.itemsOutput;
                    } else {
                        var arr = [];
                        arr.push($scope.itemsOutput);
                        var arrayObj = arr;
                    }
                    for (i = 0; i < arrayObj.length; i++) {
                        arrayObj[i].tnsBU = arrayObj[i]['tns:BU'];
                        arrayObj[i].tnsCustID = arrayObj[i]['tns:CustID'];
                        arrayObj[i].tnsCust_Name = arrayObj[i]['tns:Cust_Name'];
                        arrayObj[i].tnsItem_Desc = arrayObj[i]['tns:Item_Desc'];
                        arrayObj[i].tnsItem_Id = arrayObj[i]['tns:Item_Id'];
                        arrayObj[i].tnsItem_Name = arrayObj[i]['tns:Item_Name'];
                        arrayObj[i].tnsItem_Type = arrayObj[i]['tns:Item_Type'];
                        arrayObj[i].tnsTank = arrayObj[i]['tns:Tank'];
                        arrayObj[i].tnsTanksize = arrayObj[i]['tns:Tanksize'];
                        arrayObj[i].tnsUOM = arrayObj[i]['tns:UOM'];
                        delete arrayObj[i]['tns:BU'];
                        delete arrayObj[i]['tns:CustID'];
                        delete arrayObj[i]['tns:Cust_Name'];
                        delete arrayObj[i]['tns:Item_Desc'];
                        delete arrayObj[i]['tns:Item_Id'];
                        delete arrayObj[i]['tns:Item_Name'];
                        delete arrayObj[i]['tns:Item_Type'];
                        delete arrayObj[i]['tns:Tank'];
                        delete arrayObj[i]['tns:Tanksize'];
                        delete arrayObj[i]['tns:UOM'];
                    }
                    $ionicLoading.hide();
                    $scope.products = arrayObj;
                    ordertype = $scope.products[0].tnsItem_Type;
                    if ($scope.products[0].tnsItem_Type == "LUB") {
                        $scope.showSelection = false;
                        $rootScope.typeOfOrder = "LUB";
                        window.localStorage.setItem("typeOfOrderLocal", "LUB");
                    } else {
                        $scope.showSelection = true;
                        $rootScope.typeOfOrder = "FUEL";
                        window.localStorage.setItem("typeOfOrderLocal", "FUEL");
                    }



                }, function myError(response) {
                    alert('in error');
                    $ionicLoading.hide();
                });
                $scope.clearSearchString = function () {
                    $scope.search = "";
                }
                $scope.cartLogo = function (logoCount) {
                    if (logoCount) {

                        $location.path('/cart');
                    } else {
                        $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                        }, function (error) {
// error
                        });
                    }
                }
                $scope.productQuantity = function (tnsQuantity, tnsItem_Id, tnsTanksize) {
                    if (tnsQuantity) {
                        if (tnsQuantity > tnsTanksize && tnsTanksize) {
                            // alert('product cannot be more than max quantity for' + tnsTanksize);

                        } else {
                            if ($rootScope.cartLength) {
                                var queryupdate = "UPDATE cart SET tnsQuantity = ? WHERE tnsItem_Id = ?";
                                $cordovaSQLite.execute(db, queryupdate, [tnsQuantity, tnsItem_Id]).then(function (res) {
                                    console.log("updated successfully if: " + res.insertId);
                                }, function (err) {
                                    console.log("error in updating in error if " + JSON.stringify(err));
                                });

//$rootScope.cartItems.find(v => v.tnsItem_Id === tnsItem_Id).tnsQuantity = qty;
                            } else {

                            }
                        }
                    } else {
                        //alert('Enter the quanitity for-' + tnsItem_Id);
                    }

                };


                $scope.addToCart = function (tnsBU, tnsCustID, tnsCust_Name, tnsItem_Desc, tnsItem_Id, tnsItem_Name, tnsItem_Type, tnsTank, tnsTanksize, tnsUOM, quantity) {
                    window.localStorage.setItem("AssignedDate", new Date());
                    $scope.AssignedDate = window.localStorage.getItem("AssignedDate");
                    if ($rootScope.cartLength) {
                        var storeSql = "SELECT * FROM cart";
                        $cordovaSQLite.execute(db, storeSql, []).then(function (res) {
                            if (res.rows.length > 0) {
                                console.log("tnsStore -> " + res.rows.item(0).tnsStore);
                                if (res.rows.item(0).tnsStore == window.localStorage.getItem('selectedStoreAddress')) {
                                    if (quantity) {
                                        var tnsQuantity = quantity;
                                    } else {
                                        var tnsQuantity = "1";
                                    }
                                    var itemCheck = "SELECT * FROM cart where tnsItem_Id=?";
                                    $cordovaSQLite.execute(db, itemCheck, [tnsItem_Id]).then(function (res) {
                                        if (res.rows.length > 0) {
                                            $cordovaToast.showShortCenter('Product already exixts in cart,Product details has been updated').then(function (success) {
                                                $scope.goToCartButton = false;
                                            }, function (error) {
// error
                                            });
                                            var queryupdate = "UPDATE cart SET tnsQuantity = ? WHERE tnsItem_Id = ?";
                                            $cordovaSQLite.execute(db, queryupdate, [tnsQuantity, tnsItem_Id]).then(function (res) {
                                                console.log("updated successfully if: " + res.insertId);
                                            }, function (err) {
                                                console.log("error in updating in error if " + JSON.stringify(err));
                                            });
                                            var countSql = "SELECT count(*) AS cnt FROM cart";
                                            $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                                                $rootScope.cartLength = res.rows.item(0).cnt;
                                            });

                                        } else {
                                            $cordovaToast.showShortCenter('Added to cart successfully').then(function (success) {
                                                $scope.goToCartButton = false;
                                            }, function (error) {
// error
                                            });
//  $rootScope.cartItems.push({tnsBU: tnsBU, tnsCustID: tnsCustID, tnsCust_Name: tnsCust_Name, tnsItem_Desc: tnsItem_Desc, tnsItem_Id: tnsItem_Id, tnsItem_Name: tnsItem_Name, tnsItem_Type: tnsItem_Type, tnsTank: tnsTank, tnsTanksize: tnsTanksize, tnsUOM: tnsUOM, tnsQuantity: tnsQuantity, tnsStore: window.localStorage.getItem('selectedStoreAddress')});
                                            var query = "INSERT INTO cart (tnsBU,tnsCustID,tnsCust_Name,tnsItem_Desc,tnsItem_Id,tnsItem_Name,tnsItem_Type,tnsTank,tnsTanksize,tnsUOM,tnsQuantity,tnsStore) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                                            $cordovaSQLite.execute(db, query, [tnsBU, tnsCustID, tnsCust_Name, tnsItem_Desc, tnsItem_Id, tnsItem_Name, tnsItem_Type, tnsTank, tnsTanksize, tnsUOM, tnsQuantity, window.localStorage.getItem('selectedStoreAddress')]).then(function (res) {
                                                console.log("insertId in original logic if: " + res.insertId);
                                            }, function (err) {
                                                console.log("in error if " + JSON.stringify(err));
                                            });
                                            var countSql = "SELECT count(*) AS cnt FROM cart";
                                            $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                                                $rootScope.cartLength = res.rows.item(0).cnt;
                                            });
                                        }
                                    });
                                } else {
                                    alert("U have selected different strore,Empty the cart manually");
                                }
                            } else {
                                alert("no records in database" + res.rows.item(0).tnsStore);
                            }
                        });
                    } else {
                        if (quantity) {
                            var tnsQuantity = quantity;
                        } else {
                            var tnsQuantity = "1";
                        }
                        var itemCheck = "SELECT * FROM cart where tnsItem_Id=?";
                        $cordovaSQLite.execute(db, itemCheck, [tnsItem_Id]).then(function (res) {
                            if (res.rows.length > 0) {

                                $cordovaToast.showShortCenter('Product already exixts in cart').then(function (success) {
                                    $scope.goToCartButton = false;
                                }, function (error) {
// error
                                });
                                var queryupdate = "UPDATE cart SET tnsQuantity = ? WHERE tnsItem_Id = ?";
                                $cordovaSQLite.execute(db, queryupdate, [tnsQuantity, tnsItem_Id]).then(function (res) {
                                    console.log("updated successfully if: " + res.insertId);
                                }, function (err) {
                                    console.log("error in updating in error if " + JSON.stringify(err));
                                });
                                var countSql = "SELECT count(*) AS cnt FROM cart";
                                $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                                    $rootScope.cartLength = res.rows.item(0).cnt;
                                });
//$scope.goToCartButton = false;
                            } else {
                                $cordovaToast.showShortCenter('Added to cart successfully').then(function (success) {
                                    $scope.goToCartButton = false;
                                }, function (error) {
// error
                                });
// $rootScope.cartItems.push({tnsBU: tnsBU, tnsCustID: tnsCustID, tnsCust_Name: tnsCust_Name, tnsItem_Desc: tnsItem_Desc, tnsItem_Id: tnsItem_Id, tnsItem_Name: tnsItem_Name, tnsItem_Type: tnsItem_Type, tnsTank: tnsTank, tnsTanksize: tnsTanksize, tnsUOM: tnsUOM, tnsQuantity: tnsQuantity, tnsStore: window.localStorage.getItem('selectedStoreAddress')});
                                var query = "INSERT INTO cart (tnsBU,tnsCustID,tnsCust_Name,tnsItem_Desc,tnsItem_Id,tnsItem_Name,tnsItem_Type,tnsTank,tnsTanksize,tnsUOM,tnsQuantity,tnsStore) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
                                $cordovaSQLite.execute(db, query, [tnsBU, tnsCustID, tnsCust_Name, tnsItem_Desc, tnsItem_Id, tnsItem_Name, tnsItem_Type, tnsTank, tnsTanksize, tnsUOM, tnsQuantity, window.localStorage.getItem('selectedStoreAddress')]).then(function (res) {
                                    console.log("insertId in original logic if: " + res.insertId);
                                }, function (err) {
                                    console.log("in error if " + JSON.stringify(err));
                                });
                                var countSql = "SELECT count(*) AS cnt FROM cart";
                                $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                                    $rootScope.cartLength = res.rows.item(0).cnt;
                                });

                            }
                        });

                    }
                };
            });
            $scope.dateChange = function (selectedDate) {
                dateSelected = moment(selectedDate).format("YYYY-MM-DD");
                var new_date = moment(selectedDate, "DD-MM-YYYY").add('days', 1);

                var day = new_date.format('DD');
                var month = new_date.format('MM');
                var year = new_date.format('YYYY');
                $rootScope.changedDateCart = dateSelected;
                window.localStorage.setItem("changedDateCartLocal", $rootScope.changedDateCart);

                $rootScope.changedDateCart = dateSelected;
                window.localStorage.setItem("changedDateLocal", $rootScope.changedDateCart);


            };
            $scope.timeChange = function (selectedTime) {
                timeSelected = selectedTime;
                $rootScope.startTimeCart = selectedTime.split(',')[0];
                $rootScope.endTimeCart = selectedTime.split(',')[1];
                window.localStorage.setItem("startTimeCartLocal", $rootScope.startTimeCart);
                window.localStorage.setItem("startTimeCartLocal", $rootScope.endTimeCart);
            };

            $scope.clearSearchString = function () {
                $scope.search = "";
            };

            $scope.gotoHome = function () {
                $state.go('tab.home');
            };
            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                $location.path('/sign-in');
            };

            $scope.movetocart = function () {
                $scope.goToCartButton = true;
                var storeSql = "SELECT * FROM cart";
                $cordovaSQLite.execute(db, storeSql, []).then(function (res) {
                    if (res.rows.length > 0) {
                        if (ordertype === "FUL") {
                            if (!dateSelected && !timeSelected) {
                                $cordovaToast.showShortCenter('please select the date and time').then(function (success) {

                                }, function (error) {
// error
                                });
                            }
                            if (!dateSelected && timeSelected) {
                                $cordovaToast.showShortCenter('please select the date').then(function (success) {

                                }, function (error) {
// error
                                });
                            }
                            if (!timeSelected && dateSelected) {
                                $cordovaToast.showShortCenter('please select the time').then(function (success) {

                                }, function (error) {
// error
                                });
                            }

                            if ($rootScope.cartLength && timeSelected && dateSelected) {
//$location.path('/cart');
                                var countSql = "SELECT count(*) AS cnt FROM cart";
                                $cordovaSQLite.execute(db, countSql, []).then(function (res) {

                                    if ($rootScope.cartLength) {
                                        $location.path('/cart');
                                    }



                                });
                            }
                        } else {
                            if ($rootScope.cartLength) {
                                var countSql = "SELECT count(*) AS cnt FROM cart";
                                $cordovaSQLite.execute(db, countSql, []).then(function (res) {
                                    $rootScope.cartLength = res.rows.item(0).cnt;
                                    if ($rootScope.cartLength) {
                                        $location.path('/cart');
                                    }
                                });

                            }

                        }
                    } else {
                        $cordovaToast.showShortCenter('Add products to cart').then(function (success) {

                        }, function (error) {
// error
                        });
                    }
                });

            }
        })

        .controller('EtaCtrl', function ($scope, services, $location, $window, $cordovaDialogs, $cordovaSQLite, $rootScope, $cordovaToast) {
            $scope.$on('$ionicView.enter', function () {
                $scope.orderInvoice = "";
            });
            $scope.cartLogo = function (logoCount) {
                if (logoCount) {

                    $location.path('/cart');
                } else {
                    $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                    }, function (error) {
// error
                    });
                }
            }
            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                $location.path('/sign-in');
            };
            $scope.eta = function (eta) {
                services.etaDetails(eta).then(function mySuccess(response) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(response.Messageresult);
                    var etapackage = aftCnv.Data;
                    if (etapackage.Package) {
                        $cordovaDialogs.alert('Eta Not Planned', 'Eta Details', 'OK');

                    } else {
                        $cordovaDialogs.alert('Eta Not Planned', 'Eta Details', 'OK');
                    }
                }, function myError(response) {
                    console.log("error in  $scope.eta");

                });
            }

        })
        .controller('SdsCtrl', function ($scope, $state, $http, $location, $window, $rootScope, $cordovaToast, $cordovaSQLite) {

            $scope.$on('$ionicView.enter', function () {



            });
            $scope.openurl = function (url) {
                window.open(url, '_blank', 'location=yes');
            }
            $scope.cartLogo = function (logoCount) {
                if (logoCount) {

                    $location.path('/cart');
                } else {
                    $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                    }, function (error) {
// error
                    });
                }
            }
            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                $location.path('/sign-in');
            };


        })
        .controller('invoiceCtrl', function ($scope, $state, services, $window, $location, $rootScope, $cordovaSQLite) {
            $scope.$on('$ionicView.enter', function () {
                services.getInvoiceNumberDetails().then(function mySuccess(response) {
                    var invoiceFD = response["tns:InvoiceResponse"];
                    console.log(invoiceFD);
                    var listofitems = invoiceFD["tns:ListofItems"];
                    var items = listofitems["tns:Items"];
                    $scope.invoiceDetails = response["tns:InvoiceResponse"];
                    $scope.invoiceItems = listofitems["tns:Items"];
                    var i;
                    if (invoiceFD.length) {
                        var arrayObj = invoiceFD;
                    } else {
                        var arr = [];
                        arr.push(invoiceFD);
                        var arrayObj = arr;
                    }
                    for (i = 0; i < arrayObj.length; i++) {

                        arrayObj[i].tnsSoldTo = arrayObj[i]["tns:SoldTo"];
                        arrayObj[i].tnsShipTo = arrayObj[i]["tns:ShipTo"];
                        arrayObj[i].tnsCustomer = arrayObj[i]["tns:Customer"];
                        arrayObj[i].tnsBrnPlt = arrayObj[i]["tns:BrnPlt "];
                        arrayObj[i].tnsCertificat = arrayObj[i]["tns:Certificat "];
                        arrayObj[i].tnsOrderNo = arrayObj[i]["tns:OrderNo"];
                        arrayObj[i].tnsOrderType = arrayObj[i]["tns:OrderType"];
                        arrayObj[i].tnsInvoiceType = arrayObj[i]["tns:InvoiceType "];
                        arrayObj[i].tnsATTENTION = arrayObj[i]["tns:ATTENTION"];
                        arrayObj[i].tnsInvoiceNo = arrayObj[i]["tns:InvoiceNo"];
                        arrayObj[i].tnsInvoice_Date = arrayObj[i]["tns:Invoice_Date"];
                        arrayObj[i].tnsSHIPTOADDRESSLINE1 = arrayObj[i]["tns:SHIPTOADDRESSLINE1"];
                        arrayObj[i].tnssoldtoaddressline1 = arrayObj[i]["tns:soldtoaddressline1"];
                        arrayObj[i].tnsSHIPTOADDRESSLINE2 = arrayObj[i]["tns:SHIPTOADDRESSLINE2"];
                        arrayObj[i].tnssoldtoaddressline2 = arrayObj[i]["tns:soldtoaddressline2"];
                        arrayObj[i].tnsSHIPTOADDRESSLINE3 = arrayObj[i]["tns:SHIPTOADDRESSLINE3"];
                        arrayObj[i].tnssoldtoaddressline3 = arrayObj[i]["tns:soldtoaddressline3"];
                        arrayObj[i].tnsSHIPTOADDRESSLINE4 = arrayObj[i]["tns:SHIPTOADDRESSLINE4"];
                        arrayObj[i].tnssoldtoaddressline4 = arrayObj[i]["tns:soldtoaddressline4"];
                        arrayObj[i].tnsSHIPTOCITY = arrayObj[i]["tns:SHIPTOCITY"];
                        arrayObj[i].tnssoldtocity = arrayObj[i]["tns:soldtocity"];
                        arrayObj[i].tnsSHIPTOSTATE = arrayObj[i]["tns:SHIPTOSTATE"];
                        arrayObj[i].tnssoldtostate = arrayObj[i]["tns:soldtostate"];
                        arrayObj[i].tnsSHIPTOPOSTALCODE = arrayObj[i]["tns:SHIPTOPOSTALCODE"];
                        arrayObj[i].tnssoldtopostalcode = arrayObj[i]["tns:soldtopostalcode"];
                        arrayObj[i].tnsNETDUEDATE = arrayObj[i]["tns:NETDUEDATE"];
                        arrayObj[i].tnsRELATEDPO = arrayObj[i]["tns:RELATEDPO"];
                        arrayObj[i].tnsTAXRATE = arrayObj[i]["tns:TAXRATE"];

                        delete arrayObj[i]["tns:SoldTo"];
                        delete arrayObj[i]["tns:ShipTo"];
                        delete arrayObj[i]["tns:Customer"];
                        delete arrayObj[i]["tns:BrnPlt "];
                        delete arrayObj[i]["tns:Certificat "];
                        delete arrayObj[i]["tns:OrderNo"];
                        delete arrayObj[i]["tns:OrderType"];
                        delete arrayObj[i]["tns:InvoiceType "];
                        delete arrayObj[i]["tns:ATTENTION"];
                        delete arrayObj[i]["tns:InvoiceNo"];
                        delete arrayObj[i]["tns:Invoice_Date"];
                        delete arrayObj[i]["tns:SHIPTOADDRESSLINE1"];
                        delete arrayObj[i]["tns:soldtoaddressline1"];
                        delete arrayObj[i]["tns:SHIPTOADDRESSLINE2"];
                        delete arrayObj[i]["tns:soldtoaddressline2"];
                        delete arrayObj[i]["tns:SHIPTOADDRESSLINE3"];
                        delete arrayObj[i]["tns:soldtoaddressline3"];
                        delete arrayObj[i]["tns:SHIPTOADDRESSLINE4"];
                        delete arrayObj[i]["tns:soldtoaddressline4"];
                        delete arrayObj[i]["tns:SHIPTOCITY"];
                        delete arrayObj[i]["tns:soldtocity"];
                        delete arrayObj[i]["tns:SHIPTOSTATE"];
                        delete arrayObj[i]["tns:soldtostate"];
                        delete arrayObj[i]["tns:SHIPTOPOSTALCODE"];
                        delete arrayObj[i]["tns:soldtopostalcode"];
                        delete arrayObj[i]["tns:NETDUEDATE"];
                        delete arrayObj[i]["tns:RELATEDPO"];
                        delete arrayObj[i]["tns:TAXRATE"];

                    }
                    $scope.invoiceFullDetails = arrayObj;
                    var j;
                    if ($scope.invoiceItems.length) {
                        var arrayObj1 = $scope.invoiceItems;
                    } else {
                        var arr = [];
                        arr.push($scope.invoiceItems);
                        var arrayObj1 = arr;
                    }
                    for (j = 0; j < arrayObj1.length; j++) {
                        arrayObj1[j].tnsRequestDate = arrayObj1[j]["tns:RequestDate"];
                        arrayObj1[j].tnsCustomerPO = arrayObj1[j]["tns:CustomerPO"];
                        arrayObj1[j].tnsDeliveryInstructions = arrayObj1[j]["tns:DeliveryInstructions"];
                        arrayObj1[j].tnsLineNo = arrayObj1[j]["tns:LineNo"];
                        arrayObj1[j].tnsItemNumber = arrayObj1[j]["tns:ItemNumber"];
                        arrayObj1[j].tnsUnitOfMeasure = arrayObj1[j]["tns:UnitOfMeasure"];
                        arrayObj1[j].tnsPrice = arrayObj1[j]["tns:Price"];
                        arrayObj1[j].tnsextendedprice = arrayObj1[j]["tns:extendedprice"];
                        arrayObj1[j].tnsFOB = arrayObj1[j]["tns:FOB"];
                        arrayObj1[j].tnsDESCRIPTION = arrayObj1[j]["tns:DESCRIPTION"];
                        arrayObj1[j].tnsSHIPBACKCANCEL = arrayObj1[j]["tns:SHIPBACKCANCEL"];
                        arrayObj1[j].tnsNETPRICE = arrayObj1[j]["tns:NETPRICE"];
                        arrayObj1[j].tnsTAX = arrayObj1[j]["tns:TAX"];
                        delete arrayObj1[j]["tns:RequestDate"];
                        delete arrayObj1[j]["tns:CustomerPO"];
                        delete arrayObj1[j]["tns:DeliveryInstructions"];
                        delete arrayObj1[j]["tns:LineNo"];
                        delete arrayObj1[j]["tns:ItemNumber"];
                        delete arrayObj1[j]["tns:UnitOfMeasure"];
                        delete arrayObj1[j]["tns:Price"];
                        delete arrayObj1[j]["tns:extendedprice"];
                        delete arrayObj1[j]["tns:FOB"];
                        delete arrayObj1[j]["tns:DESCRIPTION"];
                        delete arrayObj1[j]["tns:SHIPBACKCANCEL"];
                        delete arrayObj1[j]["tns:NETPRICE"];
                        delete arrayObj1[j]["tns:TAX"];


                    }
                    $scope.invoiceItemDetails = arrayObj1;
                    console.log("$scope.invoiceItemDetails" + $scope.invoiceItemDetails);
                    $scope.totalAmount = arrayObj1.tnsextendedprice;


                }, function myError(response) {
                    alert('in error');
                });
            });
            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                var emptyDb = "DELETE FROM cart";
                $cordovaSQLite.execute(db, emptyDb, []).then(function (res) {
                    console.log("the detele response" + JSON.stringify(res));

                });
                $rootScope.customerId = " ";
                $rootScope.cartLength = "";
                $rootScope.cartItems = [];
                $rootScope.typeOfOrder = "";
                $rootScope.changedDateCart = "";
                $rootScope.startTimeCart = "";
                $rootScope.endTimeCart = "";
                $location.path('/sign-in');
            };
            $scope.gotoInvoices = function () {
                $state.go('tab.invoices');
            }
        })
        .controller('index', function ($scope, $state, $location) {
            $scope.$on('$ionicView.enter', function () {});
        });

