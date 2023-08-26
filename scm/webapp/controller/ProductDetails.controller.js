sap.ui.define([
    "com/scm/scm/controller/BaseController",
    "com/scm/scm/model/Service",
    "sap/ui/model/json/JSONModel",
    "com/scm/scm//model/formatter",
    "sap/m/MessageToast",
    "sap/ui/util/Storage"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Service, JSONModel, formatter, MessageToast, Storage) {
        "use strict";

        return BaseController.extend("com.scm.scm.controller.ProductDetails", {
            formatter: formatter,

            onInit: function () {
                // set the type of storage 
                this._oStorage = new Storage(Storage.Type.local);
                this.getRouter().getRoute("product").attachPatternMatched(this._onObjectMatched.bind(this));
            },

            onBack: function () {
                this.getRouter().navTo("home", {});
            },


            onCartPress: function () {
                var sID = this.getView().getModel("ProdModel").getData().ProductID;
                var aCartList = this._oStorage.get("CartName");
                if(aCartList){
                    var index = aCartList.indexOf(sID);
                    if (index > -1) {
                          MessageToast.show("Product Already added to Cart"); 
                    }else{    
                        aCartList.push(sID); 
                        MessageToast.show("Product has been added to Cart Successfully");
                    }    
                }else{
                    aCartList = [];
                    aCartList.push(sID); 
                    MessageToast.show("Product has been added to Cart Successfully");
                }
                this._oStorage.put("CartName", aCartList);         
            },

            onFavoritePress: function () {
                var sID = this.getView().getModel("ProdModel").getData().ProductID;
                var keyList = this._oStorage.get("FavName");
                if (keyList) {
                    var index = keyList.indexOf(sID);
                    if (index > -1) {
                        keyList.splice(index, 1);
                        this.getView().byId("idFavBut").setIcon("sap-icon://unfavorite");
                    } else {
                        keyList.push(sID);
                        this.getView().byId("idFavBut").setIcon("sap-icon://favorite");
                    }
                } else {
                    keyList = [];
                    keyList.push(sID);
                    this.getView().byId("idFavBut").setIcon("sap-icon://favorite");
                }
                this._oStorage.put("FavName", keyList);
            },


            _getKeyStorageData: function () {
                var FavList = this._oStorage.get("FavName");
                var sID = this.getView().getModel("ProdModel").getData().ProductID;
                if (FavList) {
                    var index = FavList.indexOf(sID);
                    if (index > -1) {
                        this.getView().byId("idFavBut").setIcon("sap-icon://favorite");
                    } else {
                        this.getView().byId("idFavBut").setIcon("sap-icon://unfavorite");
                    }
                }
            },


            _onObjectMatched: function (oEvent) {
                var sID = oEvent.getParameter("arguments").objectId;
                var oModel = this.getModel();

                var sURL = "/Products(" + sID + ")";
                var sUrlPar = { "$expand": "Category,Supplier" };

                sap.ui.core.BusyIndicator.show();
                // Call the Product Service
                var oProduct = Service.getKeyExpandService(oModel, sURL, sUrlPar);

                // Product Service
                oProduct.then(function (response) {
                    sap.ui.core.BusyIndicator.hide();
                    var oProdModel = new JSONModel(response);
                    this.getView().setModel(oProdModel, "ProdModel");
                    this._getKeyStorageData();
                }.bind(this)).catch(function (error) {
                    sap.ui.core.BusyIndicator.hide();
                });
            }
        });
    });
