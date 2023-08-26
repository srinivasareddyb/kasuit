sap.ui.define([
    "com/scm/scm/controller/BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.scm.scm.controller.App", {
            onInit: function () {
                // apply content density mode to root view
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            },

            onHome: function () {
                this.getRouter().navTo("dashboard", {});
            },

            onItemSelect: function (oEvent) {
                var target = oEvent.getParameter("item").getKey();
                if (target === "Favs") {
                    this.getRouter().navTo("favorites", {});
                } else if (target === "Cart") {
                    this.getRouter().navTo("cart", {});
                } else if (target === "Products") {
                    this.getRouter().navTo("home", {});
                }
            },

            onSideNavButtonPress: function () {
                var oToolPage = this.byId("idToolPage");
                // var bSideExpanded = oToolPage.getSideExpanded();
                // this.setToggleButtonTooltip(bSideExpanded);
                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            }


        });
    });
