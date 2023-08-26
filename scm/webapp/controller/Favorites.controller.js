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

        return BaseController.extend("com.scm.scm.controller.Favorites", {
            formatter: formatter,

            onInit: function () {
                this.oFavModel = new JSONModel();
                this._oStorage = new Storage(Storage.Type.local);
                this.getRouter().getRoute("favorites").attachPatternMatched(this._onObjectMatched.bind(this));
            },

            onProductSelect: function (oEvent) {
                var sProduct = oEvent.getSource().getBindingContext().getProperty("ProductID");
                this.getRouter().navTo("product", { objectId: sProduct });
            },


            onSearchFav: function (oEvent) {
                var value = oEvent.getParameter("newValue");
                var oBinding = this.FavTab.getBinding("items");
                var oFilter;

                if (value !== "" && value !== undefined) {
                    oFilter = new Filter({
                        filters: [
                            new Filter({
                                filters: [
                                    new Filter("ProductName", FilterOperator.Contains, value),
                                    new Filter("Category/CategoryName", FilterOperator.Contains, value)
                                ],
                                and: false
                            })
                        ],
                        and: true
                    });
                }
                oBinding.filter(oFilter);
            },

            onDelete: function (oEvent) {
                var FavList = this._oStorage.get("FavName");
                var sID = oEvent.getParameter("listItem").getBindingContext().getProperty("ProductID");
                if (FavList) {
                    var index = FavList.indexOf(sID);
                    if (index > -1) {
                        FavList.splice(index, 1);
                        this._oStorage.put("FavName", FavList);
                        MessageToast.show("Product has been removed from Favorites");
                        this._getFavData();
                    }
                }
            },

            _getFavData: function () {
                // Read the Data from Browser
                var FavList = this._oStorage.get("FavName");
                var oModel = this.getModel();
                this.FavTab = this.getView().byId("favT");
                this.FavTab.setModel(this.oFavModel);
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

                        oFavService.then(function (response) {
                            sap.ui.core.BusyIndicator.hide();
                            this.oFavModel.setData({
                                results: response
                            });
                        }.bind(this)).catch(function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                        });
                    } else {
                        this.oFavModel.setData({
                            results: []
                        });
                    }
                }
            },

            _onObjectMatched: function () {
                this._getFavData();
            }

        });
    });
