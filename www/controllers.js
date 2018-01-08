angular.module('starter.controllers', [])


        .controller('LoaderInCtrl', function ($scope, $state, $cordovaToast, services, $rootScope, $location, $ionicLoading) {

            $scope.$on('$ionicView.enter', function () {
                alert("loader controller entered");

                var logginSessoin = window.localStorage.getItem("email");
                alert('window.localStorage.getItem("email");' + window.localStorage.getItem("email"));

                if (logginSessoin && logginSessoin !== "null") {

                    $rootScope.customerId = window.localStorage.getItem("custid");


                    $state.go('tab.home', {reload: true});
                } else {

                    $location.path('/sign-in');

                }

//ss
            });

            $scope.forgotNavigation = function () {
                $location.path('/forgot-password');
            }
            $scope.signUpNavigation = function () {
                $location.path('/sign-up');
            }
    

        })
        
               .controller('SignInCtrl', function ($scope, $state, $cordovaToast, services, $rootScope, $location, $ionicLoading) {

$scope.$on('$ionicView.enter', function() {
alert("sign in controller entered");

//var logginSessoin=window.localStorage.getItem("email");
//alert('window.localStorage.getItem("email");'+window.localStorage.getItem("email"));
//
//if(logginSessoin && logginSessoin!=="null"){
//    alert("direct to home page");
//      $state.go('tab.home', {reload: true});
//}else{
//    alert('to login page');
    
            $scope.signIn = function (username, password) {
                $ionicLoading.show({         templateUrl: "templates/loading.html",
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
                        window.localStorage.setItem("logkey", response["tns:custid"]);
                        window.localStorage.setItem("custid", response["tns:custid"]);
                        window.localStorage.setItem("email", response["tns:email"]);
                        window.localStorage.setItem("userName", response["tns:userName"]);
                        window.localStorage.setItem("uin", response["tns:uin"]);
                        window.localStorage.setItem("status", response["tns:status"]);
                        $cordovaToast.showShortCenter('Logged-In Successfully').then(function (success) {

                            $state.go('tab.home', {reload: true});
                        }, function (error) {
// error
                        });

                    }

                }, function myError(response) {
                    alert('in error');

                    $cordovaToast.showShortCenter('Error with network').then(function (success) {
// success
                    }, function (error) {
// error
                    });
                });
           
            };
//}

//ss
});

            $scope.forgotNavigation = function () {
                $location.path('/forgot-password');
            }
            $scope.signUpNavigation = function () {
                $location.path('/sign-up');
            }
    

        })
        .controller('SignUpCtrl', function ($scope, $state, $location, services, $cordovaToast) {
//alert('in sign up controller');
            $scope.forgotNavigation = function () {
                $location.path('/forgot-password');
            };
            $scope.signInNavigation = function () {
                $location.path('/sign-in');
            };
            $scope.signUp = function (userEmail) {
//alert("teh sign up email"+userEmail);
                services.registration(userEmail).then(function mySuccess(response) {
                    //alert('in sign up details'+JSON.stringify(response));
                    console.log(response);

//             if(response.result){
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
//             }
//alert('in sign up details'+JSON.stringify(response.result));
                }, function myError(response) {
                    alert('in error');
                });

            };

        })
        .controller('logoutCtrl', function ($scope, $rootScope, $state, $location, $window) {
            $window.localStorage.clear();
            window.localStorage.setItem("logkey", "null");
            $state.go('/sign-in');

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
                    alert('in error');


                });
            }

        })

        .controller('HomeCtrl', function ($scope, services, $state, $http, $rootScope, $location, $window, $ionicLoading, $cordovaToast) {


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
                    alert('in error');
                    $ionicLoading.hide();
                });

            });
            $scope.orderLUB2 = function () {
                services.orderLUB().then(function mySuccess(response) {
                }, function myError(response) {
                    alert('in error error orderLUB');
                });
            }

            $scope.clearSearchString = function () {
                $scope.search = "";
            }
            $scope.customerDetails = $rootScope.customerId;
            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                
                $location.path('/sign-in');
            };
            $scope.cartLogo = function (logoCount) {
                //  alert("logoCount from home" + logoCount);
                if (logoCount) {

                    $location.path('/cart');
                } else {
                    $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                    }, function (error) {
// error
                    });
                }
            }

            $scope.test1 = function () {
                services.test11().then(function mySuccess(response) {
                }, function myError(response) {
                    alert('in error');
                });
            }
            $scope.test2 = function () {
                services.test22().then(function mySuccess(response) {
                }, function myError(response) {
                    alert('in error');
                });
            }

            $scope.orderLUB11 = function () {
                //alert('xml plain orderLUB11');
                var soap = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'
                '<Body>' +
                        '<VMISOCollection xmlns="http://xmlns.oracle.com/MCP_MOBILE/CSSMobileSOCreation/SOCreationBPELProcess">' +
                        '<VMISO>' +
                        '<COrderIdentifier>V</COrderIdentifier>' +
                        '<jdeOrderline>1.000</jdeOrderline>' +
                        '<item_Desc>KOST ACHIEVE AL FRH 200 BLKGA</item_Desc>' +
                        '<Item_Id>1727</Item_Id>' +
                        '<businessUnit>L01</businessUnit>' +
                        '<jdeCompany>00010</jdeCompany>' +
                        '<customerTank>60819</customerTank>' +
                        '<jdeAddressNo>[string?]</jdeAddressNo>' +
                        '<jdeShipTo>14786</jdeShipTo>' +
                        '<jdeOrderType>SO</jdeOrderType>' +
                        '<netGallonsOrdered>11</netGallonsOrdered>' +
                        '<productCode>0000013801</productCode>' +
                        '<szReqDeliDtStartString>[string?]</szReqDeliDtStartString>' +
                        '<szReqDeliDtEndString>[string?]</szReqDeliDtEndString>' +
                        '<carrier>WEB</carrier>' +
                        '<image>[string?]</image>' +
                        '<poNumber>[string?]</poNumber>' +
                        '</VMISO>' +
                        '</VMISOCollection>' +
                        '</Body>';
//                var soap = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
//                        '<Body>' +
//                        '<VMISOCollection xmlns="http://www.mcp.com/Dupre/xsd">' +
//                        '<VMISO>' +
//                        '<COrderIdentifier>V</COrderIdentifier>' +
//                        '<jdeOrderline>1.000</jdeOrderline>' +
//                        '<item_Desc>KOST ACHIEVE AL FRH 200 BLKGA</item_Desc>' +
//                        '<Item_Id>1727</Item_Id>' +
//                        '<businessUnit>L01</businessUnit>' +
//                        '<jdeCompany>00010</jdeCompany>' +
//                        '<customerTank>60819</customerTank>' +
//                        '<jdeAddressNo>[string?]</jdeAddressNo>' +
//                        '<jdeShipTo>14786</jdeShipTo>' +
//                        '<jdeOrderType>SO</jdeOrderType>' +
//                        '<netGallonsOrdered>11</netGallonsOrdered>' +
//                        '<productCode>0000013801</productCode>' +
//                        '<szReqDeliDtStartString>[string?]</szReqDeliDtStartString>' +
//                        '<szReqDeliDtEndString>[string?]</szReqDeliDtEndString>' +
//                        '<carrier>WEB</carrier>' +
//                        '<image>[string?]</image>' +
//                        '<poNumber>[string?]</poNumber>' +
//                        '</VMISO>' +
//                        '</VMISOCollection>' +
//                        '</Body>' +
//                        '</Envelope>';
//                  var soapData = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
//                        '<Body>' +
//                        '<VMISOCollection xmlns="http://www.mcp.com/Dupre/xsd">' +
//                        '<VMISO>' +
//                        '<COrderIdentifier>V</COrderIdentifier>' +
//                        '<jdeOrderline>1.000</jdeOrderline>' +
//                        '<item_Desc>KOST ACHIEVE AL FRH 200 BLKGA</item_Desc>' +
//                        '<Item_Id>1727</Item_Id>' +
//                        '<businessUnit>L01</businessUnit>' +
//                        '<jdeCompany>00010</jdeCompany>' +
//                        '<customerTank>60819</customerTank>' +
//                        '<jdeShipTo>14786</jdeShipTo>' +
//                        '<jdeOrderType>SO</jdeOrderType>' +
//                        '<netGallonsOrdered>11</netGallonsOrdered>' +
//                        '<productCode>0000013801</productCode>' +
//                        '<carrier>WEB</carrier>' +
//                        '</VMISO></VMISOCollection></Body></Envelope>';

                $http({
                    method: 'POST',
                    url: 'http://b2bpy.mcphersonoil.com:7003/soa-infra/services/MCP_MOB/CSSMobileSOCreation/socreationbpelprocess_client_ep',
                    data: soap,
                    headers: {"Content-Type": 'application/xml'}
                }).success(function (data) {
                    //alert("in success soap orderLUB11" + data);
                }).error(function (data) {
                    alert('in error soap orderLUB11' + data);
                })

            }
            $scope.locationnumber = function () {
                services.sample11().then(function mySuccess(response) {
                }, function myError(response) {
                    console.log('Error in services.sample11');
                });
            }
            $scope.orderFuel1 = function () {
                services.orderFuel().then(function mySuccess(response) {
                }, function myError(response) {
                    console.log('error in services.orderFuel');
                });
            }

            $scope.etabasedonordernumber = function () {
                services.ETAonOrderNum().then(function mySuccess(response) {
                }, function myError(response) {
                    alert('in error');
                });
            }
            $scope.pdfbyordernumber = function () {
                services.PDFonOrderNum().then(function mySuccess(response) {
                }, function myError(response) {
                    console.log('error in  services.PDFonOrderNum');
                });
            }

            $scope.moreInfo = function (store) {
                window.localStorage.setItem('selectedStore', store);
                window.localStorage.setItem('selectedStoreAddress', store.tnsAddressNumber);

                $location.path('/products');

            };

        })
        .controller('tabsCtrl', function ($scope, $rootScope, $state, $location, $window, services) {
        })
        .controller('OrdersCtrl', function ($scope, services, $ionicActionSheet, $location, base64, $window, $ionicLoading, NgTableParams, $cordovaFile, $base64, $cordovaDialogs, $ionicModal, $cordovaFileOpener2) {

            $scope.$on('$ionicView.enter', function () {
                $ionicLoading.show({
                    templateUrl: "templates/loading.html",
                    noBackdrop: false
                });
                services.customerOrders(window.localStorage.getItem("custid")).then(function mySuccess(response) {
                    $scope.orders = response;
                    var i;
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

                        delete  arrayObj[i]['tns:OrderType'];
                        delete  arrayObj[i]['tns:Date_requested'];
                        delete  arrayObj[i]['tns:Date_scheduled'];
                        delete  arrayObj[i]['tns:Unit_Of_Mes'];
                        delete  arrayObj[i]['tns:Price_Per_Unit'];
                        delete  arrayObj[i]['tns:List_Price'];
                    }
                    $ionicLoading.hide();
                    $scope.orders = arrayObj;
                    //$scope.tableParams = new NgTableParams({}, {dataset: $scope.ordersData});


                    console.log('orders' + JSON.stringify(arrayObj));

                }, function myError(response) {
                    console.log(' error in   services.customerOrders');
                    $ionicLoading.hide();

                })

            });

            $scope.logoutHome = function () {
                window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                $location.path('/sign-in');

            };
            $scope.propertyName = 'tnsDate_Ordered';
            $scope.reverse = true;
            $scope.sortBy = function (propertyName) {
                $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
                $scope.propertyName = propertyName;
            };

            $scope.sort = function (keyname) {
                //alert("in sort with key name" + keyname);
                $scope.sortKey = keyname;   //set the sortKey to the param passed
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

                        {text: '<i class="icon ion-clock"></i> Eta'},
                        {text: '<i class="icon ion-folder"></i> Pod'},
                        {text: '<i class="icon ion-eye"></i> View details'}
                    ],
                    destructiveText: 'Cancel',
                    cancelText: 'Cancel',
                    cancel: function () {
                    },
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
                                //alert("json"+JSON.stringify(myBase64));



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

                                    var blob = new Blob(byteArrays, {type: contentType});
                                    return blob;
                                }
                                function savebase64AsPDF(folderpath, filename, content, contentType) {
                                    var DataBlob = b64toBlob(content, contentType);
                                    var location = folderpath + filename;

                                    //alert('the locatio is'+location);
                                    console.log('the location' + location);
                                    console.log("Starting to write the file :3");

                                    window.resolveLocalFileSystemURL(folderpath, function (dir) {
                                        //alert("Access to the directory granted succesfully");
                                        dir.getFile(filename, {create: true}, function (file) {
                                            // alert("File created succesfully at."+location);
                                            file.createWriter(function (fileWriter) {
                                                // alert("Writing content to file");
                                                fileWriter.write(DataBlob);
                                                $cordovaFileOpener2.open(location, 'application/pdf'
                                                        ).then(function () {
                                                    //alert("file opened successfully");
                                                }, function (err) {
                                                    alert("An error occurred.");
                                                });
                                                //window.open(encodeURI(location), '_system');
                                            }, function () {
                                                alert('Unable to save file in path ' + folderpath);
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

        .controller('cartCtrl', function ($scope, $ionicPopup, $state, $rootScope, $cordovaDialogs, $location, $cordovaToast,services) { // define $ionicPopup here
//   $ionicLoading.show({
//                    templateUrl: "templates/loading.html",
//                    noBackdrop: false
//                });
                
                $scope.$on('$ionicView.enter', function() {
            $scope.cartDisabled = false;
            $scope.checkoutProducts;

            $rootScope.checkoutProducts = $rootScope.cartProducts;
            
              window.localStorage.setItem("checkoutProductsLOCAL",  $rootScope.cartProducts);
            // alert('alert the cart items are' + JSON.stringify($scope.checkoutProducts));
            $rootScope.cartLength = $rootScope.checkoutProducts.length;
             window.localStorage.setItem("cartLengthLOCAL",  $rootScope.checkoutProducts.length);
});
 
            $scope.gotoProducts = function () {
                if ($rootScope.cartLength) {
                    $cordovaDialogs.confirm('Cart will be empty', 'Cart Empty', ['OK', 'Cancel'])
                            .then(function (buttonIndex) {
                                var btnIndex = buttonIndex;
                                if (btnIndex == "1") {
                                    $rootScope.checkoutProducts = [];
                                    $rootScope.cartItems = [];
                                    $rootScope.cartLength = 0;
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
            $scope.checkoutProductQuantity = function (qty, tnsItem_Id, tnsTanksize) { 

                if (qty) {
                    
                    if (qty > tnsTanksize) {
                        //alert('product cannot be more than max quantity for' + tnsTanksize);

                    } else {
                        $rootScope.checkoutProducts.find(v => v.tnsItem_Id === tnsItem_Id).tnsQuantity = qty;
                    }
                } else {
                    alert('quanity cannot be empty for the item' + tnsItem_Id);
                }
//                if (qty <1) {
//                   // alert('product cannot be less than one'+ tnsTanksize+qty);
//                   // $scope.cartDisabled = true;
//                    $scope.qty = "1";
//                }


                $scope.checkoutProducts.find(v => v.tnsItem_Id === tnsItem_Id).tnsQuantity = qty;
            }

            $scope.removeFromCart = function (index) {
                $cordovaDialogs.confirm('Product Will Be deleted from the cart', 'Delete', ['OK', 'Cancel'])
                        .then(function (buttonIndex) {
                            var btnIndex = buttonIndex;
                            if (btnIndex == "1") {
                                $rootScope.checkoutProducts.splice(index, 1); 
                                $rootScope.cartLength = $rootScope.checkoutProducts.length;

                                if (!$rootScope.checkoutProducts.length) { 
                                    $rootScope.cartLength = $rootScope.checkoutProducts.length;
                                } else {
                                    //  alert('the length is' + $rootScope.checkoutProducts.length);
                                    $rootScope.cartLength = $rootScope.checkoutProducts.length;
                                }
                            }
// no button = 0, 'OK' = 1, 'Cancel' = 2
                        });
// $scope.cartproducts.splice(index, 1);
            };
            $scope.continueShopping = function () {

                //$scope.cartproducts = [];
                $state.go('tab.home');
                //alert("the final cart itm with quantity updation is" + JSON.stringify($scope.cartproducts));
            }



            $scope.checkout = function () {
               
                  var cartObject = [];
                $cordovaDialogs.confirm('Confirm Checkout', 'Checkout', ['OK', 'Cancel'])
                        .then(function (buttonIndex) {
                            var btnIndex = buttonIndex;
                            if (btnIndex == "1") {
                                if ($rootScope.checkoutProducts.length) {
                                    // $rootScope.cartObject = {};
                                  //  $rootScope.checkoutProducts;
                                   angular.forEach($rootScope.checkoutProducts, function (value, key) {
                                   var objectIndex = key + 1 + '.000';
                                    cartObject.push({
                                            COrderIdentifier: "V",
                                            jdeOrderline: objectIndex,
                                            item_Desc: value.tnsItem_Desc,
                                            Item_Id: value.tnsItem_Id,
                                            businessUnit: value.tnsBU,
                                            jdeCompany: "00010",
                                             //jdeShipTo: "12611",
                                            jdeShipTo: value.tnsCustID,
                                            jdeOrderType: "SO",
                                            netGallonsOrdered: value.tnsQuantity,
                                            productCode: value.tnsItem_Name,
                                            szReqDeliDtStartString: $rootScope.changedDateCart+$rootScope.startTimeCart,
                                            szReqDeliDtEndString: $rootScope.changedDateCart+$rootScope.endTimeCart
                                        });
 
   });
//  var str = JSON.stringify(cartObject);
// // alert("the stringify object");
//  var result = str.substring(1, str.length-1);
//  var result1 = str.slice(1, -1);
//  //var r=JSON.parse(result);
// 
//  
//  $scope.newString = result1.replace("},","}");
//  
//   var r1=JSON.parse($scope.newString);
//  
////  alert("the result "+JSON.stringify(result));
////    alert("the result1 "+JSON.stringify(result1));
////     alert("the r "+JSON.stringify(r));
//    alert("the r1 "+JSON.stringify(r1));
// $rootScope.rootCartObject = r1;
 
 if(cartObject){
     
     //alert("the object passing is"+JSON.stringify(cartObject));
    // console.log("cart data"+JSON.stringify(cartObject));
     services.placeCart(cartObject).then(function mySuccess(response) {
     //alert("in place cart controller success"+response);
         
          if(response === null){
              $rootScope.rootCartObject=[];
              $scope.checkoutProducts=[];
              $rootScope.cartLength="";
              
              $rootScope.cartItems.length="";
                      //alert("in response null");
                          $cordovaDialogs.alert('Order has been placed ', 'Order Status', 'OK');
                              $state.go('tab.home');
                      
                  }else{
                       $cordovaDialogs.alert('Error in placing order', 'Order Status', 'OK');
                           $state.go('tab.home');
                  }
                }, function myError(response) {
               //   alert("in place cart controller error"+response);
                     $cordovaDialogs.alert('Error in placing order', 'Order Status', 'OK');
                 
                });
 }
 
 } else {
      alert("cannot checkout ,cart has empty items");
   }
 }//button canel case
// no button = 0, 'OK' = 1, 'Cancel' = 2
                        });

            };

        })

        .controller('InvoicesCtrl', function ($scope, $location, $window, services, $ionicLoading) {



            $scope.$on('$ionicView.enter', function () {

                $ionicLoading.show({
                    templateUrl: "templates/loading.html",
                    noBackdrop: false
                });
                services.getInvoiceDetails().then(function mySuccess(response) {
                    console.log(response["tns:result"]);
                    $scope.invoiceDetails = response["tns:result"];
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
                    $ionicLoading.hide();
                    $scope.invoices = arrayObj;
                    console.log('orders' + JSON.stringify(arrayObj));
                }, function myError(response) {
                    alert('in error');
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
                $location.path('/sign-in');
            };

        })
        .controller('ProductsCtrl', function ($scope, $state, services, $location, $cordovaToast, $ionicLoading, $rootScope, $window, $cordovaDialogs) {

            $rootScope.cartItems = [];
    
            var ordertype;
            var dateSelected;
            var timeSelected;
            $scope.selectedDate = "";
            $scope.selectedTime = "";
             var dateCurrent=new Date();
             $scope.tomorrow = new Date();
            var tomorrowsDate= $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);
          
            dateCurrent.setDate(dateCurrent.getDate() + 1);
       
           $scope.minDate =  tomorrowsDate;
           
           alert("the min date is "+$scope.minDate);
            


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
                        $rootScope.typeOfOrder="LUB";
                    } else {
                        $scope.showSelection = true;
                         $rootScope.typeOfOrder="FUEL";
                    }



                }, function myError(response) {
                    alert('in error');
                    $ionicLoading.hide();
                });

                $scope.cartLogo = function (logoCount) {
                    //alert("logoCount from home" + logoCount);
                    if (logoCount) {

                        $location.path('/cart');
                    } else {
                        $cordovaToast.showShortCenter('Your cart is empty').then(function (success) {

                        }, function (error) {
// error
                        });
                    }
                }
                $scope.productQuantity = function (qty, tnsItem_Id, tnsTanksize) {
                 alert("the data"+qty+'-'+tnsItem_Id+'-'+tnsTanksize);
                    if (qty) {
                        if (qty > tnsTanksize && tnsTanksize) {
                            alert('product cannot be more than max quantity for' + tnsTanksize);

                        } else {
                            if ($rootScope.cartItems.length) {
                                $rootScope.cartItems.find(v => v.tnsItem_Id === tnsItem_Id).tnsQuantity = qty;
                            } else {

                            }
                        }
                    } else {
                       alert('Enter the quanitity for-' + tnsItem_Id);
                    }
//                   alert('in product quantity' + qty + tnsItem_Id + tnsTanksize);
//             if (qty > tnsTanksize) {
//                 //$scope.qty = "1";
//            } else {
//                cartItems.find(v => v.tnsItem_Id === tnsItem_Id).tnsQuantity = qty;
//                 }
//               alert("the array is"+JSON.stringify(cartItems));
//                   $scope.cartproducts.find(v => v.tnsItem_Id === tnsItem_Id).tnsQuantity = qty;
                };


                $scope.addToCart = function (tnsBU, tnsCustID, tnsCust_Name, tnsItem_Desc, tnsItem_Id, tnsItem_Name, tnsItem_Type, tnsTank, tnsTanksize, tnsUOM, quantity) {
                    //alert("the cart added items are" + JSON.stringify(cartItems));
                   // alert("the selected store" + window.localStorage.getItem('selectedStoreAddress'));

                    if ($rootScope.cartItems.length) {

                        var checkStore = $rootScope.cartItems[0];
                     //   alert("the store is" + JSON.stringify(checkStore));
                       // alert("ddd" + checkStore.tnsStore);

                        if (checkStore.tnsStore == window.localStorage.getItem('selectedStoreAddress')) {
                            if (quantity) {
                                var tnsQuantity = quantity;
                            } else {
                                var tnsQuantity = "1";
                            }

                            var index = $rootScope.cartItems.findIndex(x => x.tnsItem_Id === tnsItem_Id);
                            if (index === -1) {
                                $cordovaToast.showShortCenter('Added to cart successfully').then(function (success) {
// success
                                }, function (error) {
// error
                                });

                                $rootScope.cartItems.push({tnsBU: tnsBU, tnsCustID: tnsCustID, tnsCust_Name: tnsCust_Name, tnsItem_Desc: tnsItem_Desc, tnsItem_Id: tnsItem_Id, tnsItem_Name: tnsItem_Name, tnsItem_Type: tnsItem_Type, tnsTank: tnsTank, tnsTanksize: tnsTanksize, tnsUOM: tnsUOM, tnsQuantity: tnsQuantity, tnsStore: window.localStorage.getItem('selectedStoreAddress')});
                            } else {

                                $cordovaToast.showShortCenter('Product already exixts in cart').then(function (success) {
// success
                                }, function (error) {
// error
                                });
                            }
                            $rootScope.cartProducts = $rootScope.cartItems;
                            $rootScope.cartLength = $rootScope.cartProducts.length;
                            if ($rootScope.cartItems.length) {
                                $scope.isDisabled = false;
                            } else {
                                $scope.isDisabled = true;
                            }
                            //cartItems.push({tnsBU: tnsBU, tnsCustID: tnsCustID, tnsCust_Name: tnsCust_Name, tnsItem_Desc: tnsItem_Desc, tnsItem_Id: tnsItem_Id, tnsItem_Name: tnsItem_Name, tnsItem_Type: tnsItem_Type, tnsTank: tnsTank, tnsTanksize: tnsTanksize, tnsUOM: tnsUOM, tnsQuantity: tnsQuantity,tnsStore:window.localStorage.getItem('selectedStoreAddress')});
                        } else {
                            alert("U have selected different strore,Empty the cart manually");
                        }

                    } else {
                        if (quantity) {
                            var tnsQuantity = quantity;
                        } else {
                            var tnsQuantity = "1";
                        }

                        var index = $rootScope.cartItems.findIndex(x => x.tnsItem_Id === tnsItem_Id);
                        if (index === -1) {
                            $cordovaToast.showShortCenter('Added to cart successfully').then(function (success) {
// success
                            }, function (error) {
// error
                            });
                            $rootScope.cartItems.push({tnsBU: tnsBU, tnsCustID: tnsCustID, tnsCust_Name: tnsCust_Name, tnsItem_Desc: tnsItem_Desc, tnsItem_Id: tnsItem_Id, tnsItem_Name: tnsItem_Name, tnsItem_Type: tnsItem_Type, tnsTank: tnsTank, tnsTanksize: tnsTanksize, tnsUOM: tnsUOM, tnsQuantity: tnsQuantity, tnsStore: window.localStorage.getItem('selectedStoreAddress')});

                        } else {

                            $cordovaToast.showShortCenter('Product already exixts in cart').then(function (success) {
// success
                            }, function (error) {
// error
                            });
                        }
                        $rootScope.cartProducts = $rootScope.cartItems;
                        $rootScope.cartLength = $rootScope.cartProducts.length;
                        if ($rootScope.cartItems.length) {
                            $scope.isDisabled = false;
                        } else {
                            $scope.isDisabled = true;
                        }
                        //cartItems.push({tnsBU: tnsBU, tnsCustID: tnsCustID, tnsCust_Name: tnsCust_Name, tnsItem_Desc: tnsItem_Desc, tnsItem_Id: tnsItem_Id, tnsItem_Name: tnsItem_Name, tnsItem_Type: tnsItem_Type, tnsTank: tnsTank, tnsTanksize: tnsTanksize, tnsUOM: tnsUOM, tnsQuantity: tnsQuantity,tnsStore:window.localStorage.getItem('selectedStoreAddress')});
                    }

                };
            });
              $scope.dateChange = function (selectedDate) {
             dateSelected = moment(selectedDate).format("YYYY-MM-DD");
                var new_date = moment(selectedDate, "DD-MM-YYYY").add('days', 1);

                var day = new_date.format('DD');
                var month = new_date.format('MM');
                var year = new_date.format('YYYY');
                //$rootScope.changedDateCart = year + '-' + month + '-' + day;
                 $rootScope.changedDateCart = dateSelected;
           
                $rootScope.dateSelecetdCart = moment(selectedDate).format("YYYY-MM-DD"); 
                $rootScope.dayAdded=moment($rootScope.dateSelecetdCart, "YYYY-MM-DD").add(5, 'days');
            };
            $scope.timeChange = function (selectedTime) { 
                 timeSelected = selectedTime;
                $rootScope.startTimeCart = selectedTime.split(',')[0];
                $rootScope.endTimeCart = selectedTime.split(',')[1]; 
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
                $location.path('/sign-in');
            };

            $scope.movetocart = function ( ) {
                
                if ($rootScope.cartItems.length) {
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

                        if ($rootScope.cartItems.length && timeSelected && dateSelected) {
                            $location.path('/cart');
                        }
                    } else {

                        if ($rootScope.cartItems.length) {
                            $location.path('/cart');
                        }

                    }
                } else {

                    $cordovaToast.showShortCenter('select products').then(function (success) {

                    }, function (error) {
// error
                    });
                }

                if ($rootScope.cartItems.length) {
                    $scope.isDisabled = false;
                } else {
                    $scope.isDisabled = true;
                }
            }
        })

        .controller('EtaCtrl', function ($scope, services, $location, $window, $cordovaDialogs) {
            $scope.$on('$ionicView.enter', function () {
                $scope.orderInvoice = "";
            });
            $scope.logoutHome = function () {
             window.localStorage.clear();
                window.localStorage.setItem("email", "null");
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
        .controller('SdsCtrl', function ($scope, $state, $location, $window) {
            $scope.openurl = function (url) {
                window.open(url, '_blank', 'location=yes');
            }
            $scope.logoutHome = function () {
               window.localStorage.clear();
                window.localStorage.setItem("email", "null");
                $location.path('/sign-in');
            };

        })
        .controller('invoiceCtrl', function ($scope, $state, services, $window, $location) {
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
                $location.path('/sign-in');
            };
            $scope.gotoInvoices = function () {
                $state.go('tab.invoices');
            }
        })
        .controller('index', function ($scope, $state, $location) {
 $scope.$on('$ionicView.enter', function() {
//alert(" index Controller entered");
});
        });







