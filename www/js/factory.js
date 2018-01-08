angular.module('starter.factory', [])
        .factory("services", ['$soap', function ($soap) { 
                var login = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSLoginDetails_PY/csslogindetails_client_ep";
                var addressDetailsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSMobileAddressFetchService/cssmobileaddressfetchservice_client_ep";
                var addressProductsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSMobileItemsReturnWithAddressNoService/cssmobileitemsreturnwithaddressnoservice_client_ep";
                var customerOrdersURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSMobileSalesOrderDetails_PY/cssmobilesalesorderdetails_client_ep";
                var forgotPasswordURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSUserMailCheck_PY/cssusermailcheck_client_ep";
                var registrationURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSPortalNewUserCreation/cssportalnewusercreationprocess_client_ep";
                var invoicesampleURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/CSSInvoicePrintService_PY/cssinvoiceprintservice_bpel_client_ep";
                var etaDetailsURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/CSS_PY/exportOIRETAFromPortalAndJDE_PY/eta_bpel_client_ep";
                var placeCartURL = "http://b2bpy.mcphersonoil.com:7003/soa-infra/services/MCP_MOB/CSSMobileSOCreation/socreationbpelprocess_client_ep";
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
                    invoicesample: function () {
                        return $soap.post(invoicesampleURL, "process", {custId: 16467, Invoicenumber: 16299});
                    },
                    etaDetails: function (eta) {
                        return $soap.post(etaDetailsURL, "process", {JDE_Number_Input: eta});
                    },

                    placeCart: function (rootCartObject) {
                        return $soap.post(placeCartURL, "VMISOCollection", {"VMISO": rootCartObject});
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
                    getInvoiceDetails: function () {
                        return $soap.post(getInvoiceDetailsURL, "process", {CustID: "12611"});
                    },
                    deliveryInstruction: function (data) {
                        return $soap.post(deliveryInstructionURL, "process", {OrderNumber: 27967, DeliveryInstruction: data});
                    }
                }
            }]);