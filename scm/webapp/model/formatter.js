sap.ui.define([], function () {
	"use strict";
	return {
		/**
		 * 
		 * @param {*} sValue 
		 * @returns 
		 */
		getPrice: function (sValue) {
			return parseFloat(sValue, 10).toFixed(2);
		},


		/**
		 * 
		 * @param {*} status 
		 * @returns 
		 */
		getDiscontinued: function (status){
			var sValue;
             if (status === true){
				sValue = "Out of Stock";
			 }else{
				sValue = "Available";
			 }
			 return sValue;
		},

		/**
		 * @param {*} status 
		 * @returns 
		 */
		getDiscontinuedState :function(status){
			var sState;
			if (status === true){
				sState = "Error";
			}else{				
				sState = "Success";
			}
			return sState;
		},

		formatPhoto: function(sPhoto){	
			var oReutrn =  "data:image/png;base64," + sPhoto.substring(104);
			return oReutrn;			
		}
	};
});