sap.ui.define([
	//helpers
	"com/accenture/MyApp/utils/FioriComponentHelper",
	//services
	"com/accenture/MyApp/services/oDataService"
], function(FioriComponentHelper, oDataService) {
	"use strict";

	return {
		_entitySet: "/Orders",

		/*****************************************************get orders list************************************************************/
		_getCompanyListModel: function() {
			//gets component
	    	var component = FioriComponentHelper.getComponent();
			//gets model
			var jsonModel = component.byId("App").getModel("Orders");
			//checks if the model exists
			if (!jsonModel) {
				jsonModel = new sap.ui.model.json.JSONModel();
				jsonModel.setSizeLimit(9999);
				component.byId("App").setModel(jsonModel, "Orders");
				//initilializing
				jsonModel.setData({
					Busy: false,
					Orders: []
				});
			}
			return jsonModel;
		},

		_readODataOnSuccess: function(data) {
			//toma modelo
			var jsonModel = this._getCompanyListModel();
			//setea busy
			jsonModel.setProperty("/Busy", false);
			//setea datos
			jsonModel.setProperty("/Orders", data.results);
			//updates model
			jsonModel.updateBindings(true);
		},

		_readODataOnError: function(error) {
			//TODO: manejo de errores
		},

		loadModel: function() {
			// toma modelo
			var model = this._getCompanyListModel();
			// setea busy
			model.setProperty("/Busy", true);
			// setea datos
			model.setProperty("/Orders", []);
			// get oData Model
			var odataModel = oDataService.getModel();
			// call service
			odataModel.read(this._entitySet, {
				success: jQuery.proxy(this._readODataOnSuccess, this),
				error: jQuery.proxy(this._readODataOnError, this)
			});
		}

	};
});