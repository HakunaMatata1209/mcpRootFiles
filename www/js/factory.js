angular.module('starter.factory', [])
        .filter('reverse', function () {
            return function (items) {
                return items.slice().reverse();
            };
        })
        .filter('unique', function () {
            return function (arr, field) {
                var o = {}, i, l = arr.length, r = [];
                for (i = 0; i < l; i += 1) {
                    o[arr[i][field]] = arr[i];
                }
                for (i in o) {
                    r.push(o[i]);
                }
                return r;
            };
        })
//        .directive('nextFocus', function () {
//            return {
//                restrict: 'A',
//                link: function (scope, elem, attrs) {
//                    elem.bind('keydown', function (e) {
//                        var code = e.keyCode || e.which;
//                        if (code === 13) {
//                            e.preventDefault();
//                            try {
//                                if (attrs.tabindex !== undefined) {
//                                    var currentTabeIndex = attrs.tabindex;
//                                    var nextTabIndex = parseInt(currentTabeIndex) + 1;
//                                    var elems = document.querySelectorAll("[tabindex]");
//                                    for (var i = 0, len = elems.length; i < len; i++) {
//                                        var el = angular.element(elems[i]);
//                                        var idx = parseInt(el.attr('tabindex'));
//                                        if (idx === nextTabIndex) {
//                                            elems[i].focus();
//                                            break;
//                                        }
//                                    }
//                                }
//                            } catch (e) {
//                                console.log('Focus error: ' + e);
//                            }
//                        }
//                    });
//                }
//            };
//        })
.directive('focus', function() {
  return {
    restrict: 'A',
    link: function($scope,elem,attrs) {

      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          e.preventDefault();
          elem.next().focus();
        }
      });
    }
  }
})
        .factory("services", ['$soap', '$http', function ($soap, $http) {
                var login = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSLoginDetails_PY/csslogindetails_client_ep";
                var addressDetailsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSMobileAddressFetchService/cssmobileaddressfetchservice_client_ep";
                var addressProductsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSMobileItemsReturnWithAddressNoService/cssmobileitemsreturnwithaddressnoservice_client_ep";
                var customerOrdersURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSMobileSalesOrderDetails_PY/cssmobilesalesorderdetails_client_ep";
                var forgotPasswordURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSUserMailCheck_PY/cssusermailcheck_client_ep";
                var registrationURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSPortalNewUserCreation/cssportalnewusercreationprocess_client_ep";
                var invoicesampleURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSInvoicePrintService_PY/cssinvoiceprintservice_bpel_client_ep";
                var etaDetailsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/exportOIRETAFromPortalAndJDE_PY/eta_bpel_client_ep";
                var placeCartURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/MCP_MOB/CSSMobileSOCreation/socreationbpelprocess_client_ep?WSDL";
                var getInvoiceNumberDetailsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/MCP_MOB/CSSInvoicePrintService_PY/cssinvoiceprintservice_bpel_client_ep";
                var ETAonOrderNumURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/exportOIRETAFromPortalAndJDE_PY/eta_bpel_client_ep";
                var PDFonOrderNumURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSPODService_PY/csspodtest_bpel_client_ep";
                var getInvoiceDetailsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/MCP_MOB/CSSInvoiceDetails/cssinvoicebpelprocess_client_ep";
                var deliveryInstructionURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSUpdateDIWithOrderID/cssupdatediwithorderid_bpel_client_ep";

                return {
                    loginUser: function (username, passwordSha1) {
                        //e35bece6c5e6e0e86ca51d0440e92282a9d6ac8a
                        return $soap.post(login, "process", {pEmail: username, pPassword: passwordSha1});
                    },
                    addressDetails: function (EmailId) {
                        return $soap.post(addressDetailsURL, "process", {EmailId: EmailId});
                    },
                    addressProducts: function (LocationNumber) {
                        return $soap.post(addressProductsURL, "process", {LocationNumber: LocationNumber});
                    },
                    forgotPassword: function (EmailId, pUIN) {
                        return $soap.post(forgotPasswordURL, "process", {pEmail: EmailId, pUIN: pUIN});
                    },
                    customerOrders: function (CustId) {
                        return $soap.post(customerOrdersURL, "process", {input: CustId});
                    },
                    registration: function (EmailID) {
                        return $soap.post(registrationURL, "process", {EmailID: EmailID, Portal_type: "customer", Status: "0"});
                    },
//                    invoicesample: function () {
//                        return $soap.post(invoicesampleURL, "process", {custId: 16467, Invoicenumber: 16299});
//                    },
                    etaDetails: function (eta) {
                        return $soap.post(etaDetailsURL, "process", {JDE_Number_Input: eta});
                    },

                    placeCart: function (rootCartObject,info) {
                        //  var options = {responseType: 'text'};
                    //    alert("the info is"+JSON.stringify(info));
                     //   alert(info.orderInstruction+info.orderInstructionEmail+info.orderInstructionPo);
                    //   alert("in place cart"+JSON.stringify(rootCartObject));
                    //   var Email=info.orderInstructionEmail;
                   //    var PoNumber=info.orderInstructionPo;
                        var regexp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;  
                        window.localStorage.setItem("OrderPoNumber", info.orderInstructionPo);
                        var valid = regexp.test(info.orderInstructionEmail);
                        if (valid == true) { 
                            window.localStorage.setItem("OrderEmail", info.orderInstructionEmail);
                        } else {
                            window.localStorage.setItem("OrderEmail", " ");
                        }
                        /*  var soap = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
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
                         '<jdeShipTo>14786</jdeShipTo>' +
                         '<jdeOrderType>SO</jdeOrderType>' +
                         '<netGallonsOrdered>12</netGallonsOrdered>' +
                         '<productCode>0000013801</productCode>' +
                         '<carrier>WEB</carrier>' +
                         '</VMISO>' +
                         '</VMISOCollection>' +
                         '</Body>' +
                         '</Envelope>';*/
//                         COrderIdentifier: "V",
//                                                jdeOrderline: objectIndex,
//                                                item_Desc: value.tnsItem_Desc,
//                                                Item_Id: value.tnsItem_Id,
//                                                businessUnit: value.tnsBU,
//                                                jdeCompany: "00010",
//                                                jdeShipTo: value.tnsCustID,
//                                                jdeOrderType: "SO",
//                                                netGallonsOrdered: value.tnsQuantity,
//                                                productCode: value.tnsItem_Name,
//                                                szReqDeliDtStartString: $rootScope.changedDateCart + $rootScope.startTimeCart,
//                                                szReqDeliDtEndString:
                        var xmlString = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Body><VMISOCollection xmlns="http://xmlns.oracle.com/MCP_MOBILE/CSSMobileSOCreation/SOCreationBPELProcess">';
                        for (var i = 0; i < rootCartObject.length; i++) {
                            //alert(rootCartObject[i].COrderIdentifier);
                            // xmlString += '<exampleElement>' + rootCartObject[i] + '</exampleElement>';
                            xmlString += '<VMISO>';
                            xmlString += '<COrderIdentifier>' + rootCartObject[i].COrderIdentifier + '</COrderIdentifier>';
                            xmlString += '<jdeOrderline>' + rootCartObject[i].jdeOrderline + '</jdeOrderline>';
                            xmlString += '<item_Desc>' + rootCartObject[i].item_Desc + '</item_Desc>';
                            xmlString += '<Item_Id>' + rootCartObject[i].Item_Id + '</Item_Id>';
                            // xmlString += '<Item_name>' + rootCartObject[i] + '</Item_name>';
                            xmlString += '<businessUnit>' + rootCartObject[i].businessUnit + '</businessUnit>';
                            xmlString += '<jdeCompany>' + rootCartObject[i].jdeCompany + '</jdeCompany>';
                            xmlString += '<customerTank>' + rootCartObject[i].customerTank + '</customerTank>';
                            //  xmlString += '<jdeAddressNo>' + rootCartObject[i] + '</jdeAddressNo>';
                            xmlString += '<jdeShipTo>' + rootCartObject[i].jdeShipTo + '</jdeShipTo>';
                            xmlString += '<jdeOrderType>' + rootCartObject[i].jdeOrderType + '</jdeOrderType>';
                            xmlString += '<netGallonsOrdered>' + rootCartObject[i].netGallonsOrdered + '</netGallonsOrdered>';
                            xmlString += '<productCode>' + rootCartObject[i].productCode + '</productCode>';
                            xmlString += '<szReqDeliDtStartString>' + rootCartObject[i].szReqDeliDtStartString + '</szReqDeliDtStartString>';
                            xmlString += '<szReqDeliDtEndString>' + rootCartObject[i].szReqDeliDtEndString + '</szReqDeliDtEndString>';
                            xmlString += '<carrier>Mobile</carrier>';
                            xmlString += '<poNumber>'+window.localStorage.getItem("OrderPoNumber")+'</poNumber>';
                            xmlString += '<Email>'+window.localStorage.getItem("OrderEmail")+'</Email>';
                            // xmlString += '<image>' + rootCartObject[i] + '</image>';
                            // xmlString += '<poNumber>' + rootCartObject[i] + '</poNumber>'; 
                            xmlString += '</VMISO>';
                        }

                        xmlString += '</VMISOCollection></Body></Envelope> ';



                        return $http({
                            method: 'POST',
                            url: placeCartURL,
                            data: xmlString,
                            //  headers: {"Content-Type": 'application/xml'}
                            headers: {
                                'Content-type': 'text/xml',
                                'Accept': 'text/html,text/xml,application/xhtml+xml,application/xml,application/xml;'
                            }
                        }).success(function (data) {
                            console.log("the success data" + data);

                        }).error(function (data) {
                            console.log("the error data" + data);
                        });
                        //  return $soap.post("http://b2bpy.mcphersonoil.com:7003/soa-infra/services/testing/CSSMobileSOCreation/socreationbpelprocess_client_ep", "VMISOCollection", {"VMISO": rootCartObject},options);
                    },
                    getInvoiceNumberDetails: function () {
                        return $soap.post(getInvoiceNumberDetailsURL, "process", {custId: window.localStorage.getItem("addressNumber"), Invoicenumber: window.localStorage.getItem("invoiceNumber")});
                    },
                    ETAonOrderNum: function () {
                        return $soap.post(ETAonOrderNumURL, "process", {JDE_Number_Input: "20103"});
                    },
                    PDFonOrderNum: function (num) {
                        return $soap.post(PDFonOrderNumURL, "process", {input: "3972"});
                    },
                    getInvoiceDetails: function (CustId) {
                        return $soap.post(getInvoiceDetailsURL, "process", {CustID: CustId});
                    },
                    deliveryInstruction: function (orderNumber, instruction, email) {
                        return $soap.post(deliveryInstructionURL, "process", {OrderNumber: orderNumber, DeliveryInstruction: instruction});
                    }
                }
            }]);