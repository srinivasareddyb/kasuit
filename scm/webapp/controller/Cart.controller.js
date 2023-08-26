sap.ui.define([
    "com/scm/scm/controller/BaseController",
    "com/scm/scm/model/Service",
    "sap/ui/model/json/JSONModel",
    "com/scm/scm//model/formatter",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/util/Storage"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Service, JSONModel, formatter, MessageToast, Filter, FilterOperator, Storage) {
        "use strict";

        return BaseController.extend("com.scm.scm.controller.Cart", {
            formatter: formatter,

            onInit: function () {
                this.oCartModel = new JSONModel();
                this._oStorage = new Storage(Storage.Type.local);
                this.getRouter().getRoute("cart").attachPatternMatched(this._onObjectMatched.bind(this));
            },

            onRemove: function (oEvent) {
                var sID = oEvent.getSource().getBindingContext().getObject("ProductID");
                var CartList = this._oStorage.get("CartName");
                var aData = this.oCartModel.getData();

                if (CartList) {
                    var index = CartList.indexOf(sID);
                    if (index > -1) {
                        CartList.splice(index, 1);
                        this._oStorage.put("CartName", CartList);
                        MessageToast.show("Product has been removed from Cart");
                        if (aData) {
                            var aRec = aData.results;
                            const iIndex = aRec.findIndex(object => { return object.ProductID === sID; });
                            aRec.splice(iIndex, 1);
                            this.oCartModel.setData({
                                results: aRec
                            });
                            this.CartTab.setModel(this.oCartModel);
                        }
                    }
                }

            },


            onCheckOut:function(){
                    var aSelectItems = this.CartTab.getSelectedItems();
                    if(aSelectItems.length > 0){
                        var sID, sPrd , sQty, sPrice, sTotalPrice;
                        this.aData = [];
                        for(var i = 0; i < aSelectItems.length; i++){
                            sID = aSelectItems[i].getBindingContext().getProperty("ProductID");
                            sPrd = aSelectItems[i].getBindingContext().getProperty("ProductName");
                            sQty = aSelectItems[i].getCells()[4].getValue();
                            sPrice = aSelectItems[i].getCells()[6].getNumber();
                            sTotalPrice = sQty * sPrice;

                            sTotalPrice = parseFloat(sTotalPrice, 10).toFixed(2);

                           var sObj = {
                              "ID" : sID,
                              "Product" : sPrd,
                              "Quantity" : sQty,
                              "Price" : sTotalPrice
                           };
                          this.aData.push(sObj);

                        }
                    }else{
                        MessageToast.show("Please select the atleat one Record");
                    }
            },


            _getCartData: function () {
                // Read the Data from Browser
                var CartList = this._oStorage.get("CartName");
                var oModel = this.getModel();
                this.CartTab = this.getView().byId("cartT");
                this.CartTab.setModel(this.oCartModel);
                if (CartList) {
                    if (CartList.length > 0) {
                        var aFilter = [];
                        for (var i = 0; i < CartList.length; i++) {
                            var sFilter = new sap.ui.model.Filter({
                                path: "ProductID",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: CartList[i]
                            });
                            aFilter.push(sFilter);
                        }

                        var sURL = "/Products";
                        var sUrlPar = { "$expand": "Category,Supplier" };
                        var oCartService = Service.getFilterExpandService(oModel, sURL, sUrlPar, aFilter);

                        sap.ui.core.BusyIndicator.show();

                        oCartService.then(function (response) {
                            sap.ui.core.BusyIndicator.hide();
                            this.oCartModel.setData({
                                results: response
                            });
                        }.bind(this)).catch(function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                        });
                    } else {
                        this.oCartModel.setData({
                            results: []
                        });
                    }
                }
            },

            _onObjectMatched: function () {
                this._getCartData();
            }
        });
    });
