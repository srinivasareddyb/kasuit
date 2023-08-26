sap.ui.define([
    "com/scm/scm/controller/BaseController",
    "com/scm/scm/model/Service",
    "sap/ui/model/json/JSONModel",
    "com/scm/scm//model/formatter",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Service, JSONModel, formatter,MessageToast) {
        "use strict";

        return BaseController.extend("com.scm.scm.controller.Home", {
            formatter: formatter,

            onInit: function () {
                this.productModel = new JSONModel();
                this.getRouter().getRoute("home").attachPatternMatched(this._onObjectMatched.bind(this));
            },

            /**
             * 
             * @param {Object} oEvent - Event
             */
            onProductSelect: function (oEvent) {
                var sProduct = oEvent.getParameter("listItem").getBindingContext().getProperty("ProductID");
                this.getRouter().navTo("product", { objectId: sProduct });
            },

            _onObjectMatched: function () {
                var oModel = this.getModel();
                var sUrl = "/Products";
                var sUrlPar = { "$expand": "Category" };

                this.productlist = this.byId("idProductList");
               
                this.productlist.setModel(this.productModel);
                
                sap.ui.core.BusyIndicator.show();
                var oGetExpandService = Service.getExpandService(oModel, sUrl, sUrlPar);
                oGetExpandService.then(function (response) {
                    sap.ui.core.BusyIndicator.hide();
                    this.productModel.setData({
                        results: response
                    });
                }.bind(this)).catch(function (oError) {
                    sap.ui.core.BusyIndicator.hide();

                });
            }


        });
    });
