sap.ui.define([
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (Filter, FilterOperator) {
    "use strict";

    return {

        /**
         * 
         * @param {Object} oModel - Model
         * @param {String} sUrl - Entity Name
         * @param {String} SUrlPar - Exapnd Entity name
         * @returns Object -Results/ Error
         */
        getExpandService: function (oModel, sUrl, SUrlPar) {
            return new Promise(function (resolve, reject) {
                oModel.read(sUrl, {
                    urlParameters: SUrlPar,
                    success: function (oData) {
                        resolve(oData.results);
                    }, error: function (oError) {
                        reject(oError);
                    }
                });
            });
        },

        getKeyExpandService: function (oModel, sUrl, SUrlPar) {
            return new Promise(function (resolve, reject) {
                oModel.read(sUrl, {
                    urlParameters: SUrlPar,
                    success: function (oData) {
                        resolve(oData);
                    }, error: function (oError) {
                        reject(oError);
                    }
                });
            });
        },

        getFilterExpandService: function (oModel, sUrl, SUrlPar,oFilter) {
            return new Promise(function (resolve, reject) {
                oModel.read(sUrl, {
                    urlParameters: SUrlPar,
                    filters: oFilter,
                    success: function (oData) {
                        resolve(oData.results);
                    }, error: function (oError) {
                        reject(oError);
                    }
                });
            });
        },


       /**
        * 
        * @param {*} oModel 
        * @param {*} sUrl 
        * @returns 
        */
        getKeyService: function (oModel, sUrl) {
            return new Promise(function (resolve, reject) {
                oModel.read(sUrl, {
                    success: function (oData) {
                        resolve(oData);
                    }, error: function (oError) {
                        reject(oError);
                    }
                });
            });
        },

        getService: function (oModel, sUrl) {
            return new Promise(function (resolve, reject) {
                oModel.read(sUrl, {
                    success: function (oData) {
                        resolve(oData.results);
                    }, error: function (oError) {
                        reject(oError);
                    }
                });
            });
        }
    }

});