sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.prod.demo.proddemo.controller.ProdList", {
            onInit: function () {

            },
            // Worflow API
		    fetchCsrfWorkFlow: function () {
			  var dfd = $.Deferred();

			$.ajax({
                url: this.getOwnerComponent().getManifestObject().resolveUri("rest/v1/xsrf-token"),
				type: "GET",
				headers: {
					"X-CSRF-Token": "Fetch"
				}
			}).then(
				function (data, status, jqXHR) {
					var csrfToken = jqXHR.getResponseHeader("x-csrf-token");
					dfd.resolve(csrfToken);
				},
				function (jqXHR, textStatus, errorThrown) {
					dfd.resolve(false);
				}
			);

			return dfd;

		  },
          startWorkflow: function (objectSend, wfName) {
			var dfd = $.Deferred();
			var dfdCsrf = this.fetchCsrfWorkFlow();
			var postUrl = this.getOwnerComponent().getManifestObject().resolveUri("rest/v1/workflow-instances");
			$.when(dfdCsrf).then(function (csrfToken) {
			//	if (csrfToken) {
					$.ajax({
                        url: postUrl,
						type: "POST",
						headers: {
						//	"X-CSRF-Token": csrfToken,
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                            
						},
						data: JSON.stringify({
							"definitionId": wfName,
							"context": objectSend
						})
					}).then(
						function (data, status, jqXHR) {
							dfd.resolve(data.id);
						},
						function (jqXHR, textStatus, errorThrown) {
							dfd.resolve(false);
						}
					);
			//	} else {
			//		//Error al obtener csrf.
			//		dfd.resolve(false);
			//	}
			});

			return dfd.promise();
		},
        startWFInstance : function(event){
           var that=this;
           var productID= parseInt(this.getView().byId("idProduct").mProperties.selectedKey);
           var oContext = {
                "ProductId": productID
            };
           var dfd = that.startWorkflow(oContext, "product");
           $.when(dfd).then(function () {
            that.getView().setBusy(false);
            sap.m.MessageToast.show("Request created succesfully");
          
        });






        }


        });
    });
