sap.ui.define([], function() {
	"use strict";

	return {
		_destination: "/Northwind/V2/Northwind",
		_servicePath: "/Northwind.svc",
		
		//session language
		_defaultSessionLanguage: "ES",
		_otherSessionLanguages: [
			"EN","PT"
		],
		
		_getSessionLanguage: function() {
			//gets browser language
			var browserLanguage = sap.ui.getCore().getConfiguration().getSAPLogonLanguage();
			//finds language
			var results = jQuery.grep(this._otherSessionLanguages, function(otherLanguage) {
				return browserLanguage === otherLanguage;
			});
			//returns sap session language
			return (results.length > 0) ? browserLanguage : this._defaultSessionLanguage;
		},
		
		_model: null,
		getModel: function() {
			if (!this._model) {
				//gets SAP session language
				var sessionLanguage = this._getSessionLanguage();
				//builds model
				var url = this._destination + this._servicePath;
				this._model = new sap.ui.model.odata.ODataModel(url, {
					json: true,
					headers: {
						"DataServiceVersion": "2.0",
						"Cache-Control": "no-cache, no-store",
						"Pragma": "no-cache"
					},
					metadataUrlParams: {
						"sap-language" : sessionLanguage
					},
					serviceUrlParams: {	
						"sap-language" : sessionLanguage
					}
				});
			}
			return this._model;
		}
	};
});