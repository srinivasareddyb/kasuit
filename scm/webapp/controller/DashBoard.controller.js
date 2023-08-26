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
    function (BaseController, Service, JSONModel, formatter, MessageToast, Filter, FilterOperator, Storage) {
        "use strict";

        return BaseController.extend("com.scm.scm.controller.DashBoard", {
            formatter: formatter,

            onInit: function () {
                this.oFavModel = new JSONModel();
                this._oStorage = new Storage(Storage.Type.local);
                this.getRouter().getRoute("dashboard").attachPatternMatched(this._onObjectMatched.bind(this));
            },

            onCartPress:function(){
                this.getRouter().navTo("cart", {});
            },

            onFavPress:function(){
                this.getRouter().navTo("favorites", {});
            },

          
            _getFavData: function () {
                var FavList = this._oStorage.get("FavName");
                var oModel = this.getModel();
                this.favCon = this.getView().byId("Favcont");
                if (FavList) {
                    if (FavList.length > 0) {
                        var aFilter = [];
                        for (var i = 0; i < FavList.length; i++) {
                            var sFilter = new sap.ui.model.Filter({
                                path: "ProductID",
                                operator: sap.ui.model.FilterOperator.EQ,
                                value1: FavList[i]
                            });
                            aFilter.push(sFilter);
                        }

                        var sURL = "/Products";
                        var sUrlPar = { "$expand": "Category,Supplier" };
                        var oFavService = Service.getFilterExpandService(oModel, sURL, sUrlPar, aFilter);

                        sap.ui.core.BusyIndicator.show();

                        // var noContent = new sap.m.GenericTile({
                        //     header: this.i18n.getText("noDataAvail")
                        // }).addStyleClass("sapUiTinyMarginTop");

                        oFavService.then(function (response) {
                            sap.ui.core.BusyIndicator.hide();
                            for (var j = 0; j < response.length; j++) {
                                this.favCon.addContent(new sap.m.GenericTile({
                                    header: response[j].ProductName,
                                    subheader: response[j].Category.CategoryName,
                                    // press: that.getProductDetails,
                                    tileContent: [
                                        new sap.m.TileContent({
                                            unit: "USD",
                                            footer: formatter.getPrice(response[j].UnitPrice),
                                            content: [
                                                new sap.m.ImageContent({
                                                    src: formatter.formatPhoto(response[j].Category.Picture)
                                                })
                                            ]
                                        })
                                    ]
                                }).addStyleClass("sapUiTinyMarginTop"));
                            }
                        }.bind(this)).catch(function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                        });
                    }
                }
            },

            _getCartData: function () {
                // Read the Data from Browser
                var CartList = this._oStorage.get("CartName");
                var oModel = this.getModel();
                this.CartTab = this.getView().byId("CartCont");
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

                            for (var j = 0; j < response.length; j++) {
                                this.CartTab.addContent(new sap.m.GenericTile({
                                    header: response[j].ProductName,
                                    subheader: response[j].Category.CategoryName,
                                    // press: that.getProductDetails,
                                    tileContent: [
                                        new sap.m.TileContent({
                                            unit: "USD",
                                            footer: formatter.getPrice(response[j].UnitPrice),
                                            content: [
                                                new sap.m.ImageContent({
                                                    src: formatter.formatPhoto(response[j].Category.Picture)
                                                })
                                            ]
                                        })
                                    ]
                                }).addStyleClass("sapUiTinyMarginTop"));
                            }
                        }.bind(this)).catch(function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                        });
                    }
                }
            },

            _onClearData:function(){
                this.getView().byId("CartCont").removeAllContent();
                this.getView().byId("Favcont").removeAllContent();
            },

            _onObjectMatched: function () {
                this._onClearData();
                this._getFavData();
                this._getCartData();
            }


        });

    });
