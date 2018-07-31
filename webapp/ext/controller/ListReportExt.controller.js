sap.ui.controller("com.capita.cpm.poc.zmanagecontract.ext.controller.ListReportExt", {
	onBindUnBindClick: function (oEvent) {
		var oSelectedContexted = this.extensionAPI.getSelectedContexts()[0];
		if (oSelectedContexted) {
			// Check whether its locked, if so unlock otherwise lock.
			var sPath = this.extensionAPI.getSelectedContexts()[0].sPath;
			var bLocked = this.getView().getModel().getProperty(sPath + "/Locked");
			if (bLocked) {
				this.getView().getModel().setProperty(sPath + "/Locked", false);
				this.getView().getModel().setProperty(sPath + "/Deleteable", true);
				this.getView().getModel().setProperty(sPath + "/Editable", true);
				this.getView().getModel().setProperty(sPath + "/LockImageUrl", "sap-icon://unlocked");
			} else {
				this.getView().getModel().setProperty(sPath + "/Locked", true);
				this.getView().getModel().setProperty(sPath + "/Deleteable", false);
				this.getView().getModel().setProperty(sPath + "/Editable", false);
				this.getView().getModel().setProperty(sPath + "/LockImageUrl", "sap-icon://locked");
			}
		} else {
			sap.m.MessageToast.show("Please select a sales contract");
		}
	},
	onSalesOrderCreateWizard: function (oEvent) {
		var oThat = this;
		var sFragmentPath = "com.capita.cpm.poc.zmanagecontract.ext.fragments.SalesOrderWizardCreate";
		var oModel = this.getView().getModel();
		var sPath = "A_SalesOrder";
		var oExtensionAPI = this.extensionAPI;

		// Set busy indicator
		this.getView().setBusy(true);

		// Success function
		var fnSuccess = function (oResponse) {
			if (!oResponse) {
				return;
			}

			// create a context from the response
			var oContext = new sap.ui.model.Context(oModel, oResponse.context.sPath);
			var _oDialog = sap.ui.xmlfragment(oThat.getView().getId(), sFragmentPath, {
				onCreatePress: function (e) {
					// refresh the table (aka remove the deleted entry)
					oModel.refresh(true);

					// close this dialog
					_oDialog.close();
				},
				onCancelPress: function () {
					oModel.remove(
						"", {
							context: oContext,
							success: function () {
								// refresh the table (aka remove the deleted entry)
								oModel.refresh(true);

								// close this dialog
								_oDialog.close();
							}
						}
					);
				},
				afterClose: function () {
					// due to program structure we need to destroy the dialog,
					// otherwise the context will stay the same
					_oDialog.destroy();
				},
				onNextPressed: function(){
					oThat.getView().byId("CreateProductWizard").nextStep();
				}
			});

			// Remove busy.
			oThat.getView().setBusy(false);

			// bind the new context to the dialog and allow editing
			_oDialog.setBindingContext(oContext);

			// show the dialog
			oExtensionAPI.attachToView(_oDialog);
			_oDialog.open();

			// update the model so the list report is up to date
			oModel.refresh(true);

		};

		// prepare an error handler for plan creation request
		var fnError = function (oError) {
			this.getView().setBusy(false);
			//this._handleMessagePopover(oThat);
		}.bind(this);

		// prepare a draft controller
		var oDraftController = new sap.ui.generic.app.transaction.DraftController(oModel);

		// actually make the request
		oDraftController.createNewDraftEntity(sPath, sPath, this.getNewSalesOrderTemplate()).then(fnSuccess).catch(fnError);

	},
	getNewSalesOrderTemplate: function () {
		return {
			"__metadata": {
				"uri": "A_SalesOrder('4000000004')",
				"type": "API_SALES_ORDER_SRV.A_SalesOrderType"
			},
			"SalesOrder": "4000000004",
			"SalesOrderText": "Test Sales Contract",
			"SoldToParty": "8000000053",
			"SoldToPartyText": "Civil Nuclear Constabulary",
			"SalesOrganization": "0123",
			"SalesOrderType": "02",
			"ValidFrom": "/Date(1513123200000)/",
			"ValidTo": "/Date(1639526400000)/",
			"OrderLoggingValue": "511500",
			"TotalContractedValue": "1250",
			"TransactionCurrency": "GBP",
			"MasterContract": "01",
			"MasterContractText": "O2",
			"TotalUncontractedValue": 3456,
			"Framework": "01",
			"FrameworkText": "Framework Value 1",
			"Progress": "80",
			"ProgressCriticality": "3",
			"Deleteable": true,
			"Editable": true,
			"LockImageUrl": "sap-icon://unlocked",
			"Locked": false,
			"to_Item": {
				"__deferred": {
					"uri": "A_SalesOrder('4000000004')/to_Item"
				}
			},
			"to_DocumentType": {
				"__deferred": {
					"uri": "A_SalesOrder('4000000004)/to_DocumentType"
				}
			},
			"to_SalesOrg": {
				"__deferred": {
					"uri": "A_SalesOrder('4000000004')/to_SalesOrg"
				}
			},
			"to_Framework": {
				"__deferred": {
					"uri": "A_SalesOrder('4000000004')/to_Framework"
				}
			},
			"to_MasterContract": {
				"__deferred": {
					"uri": "A_SalesOrder('4000000004')/to_MasterContract"
				}
			},
			"to_SoldToParty": {
				"__deferred": {
					"uri": "A_SalesOrder('4000000004')/to_SoldToParty"
				}
			},
			"CreationDate": "/Date(1513641600000)/",
			"CreatedByUser": "Andy Sargent",
			"LastChangeDate": "/Date(1545350400000)/"
		};
	},
	onBeforeRebindTableExtension: function (oEvent) {
		/**
	  	var oID = oEvent.getSource().getId();
	  	var tableId = "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table";
	  	// to select only one specific table
	 	 switch (oID) {
	    	case tableId:
	      	// implement your logic for table 1 here
	      	break;
	   	 default :
	    	  // implement your default logic for all others here
	    	  return;
	  	 }	
	  	 **/
	},
	onListNavigationExtension: function (oEvent) {
		/**	
			 var oNavigationController = this.extensionAPI.getNavigationController();
			 var oBindingContext = oEvent.getSource().getBindingContext();
			 var oObject = oBindingContext.getObject();
			 // for notebooks we trigger external navigation for all others we use internal navigation
			 if (oObject.ProductCategory == "Notebooks") {
			    oNavigationController.navigateExternal("EPMProductManageSt");
			 } else {
			    // return false to trigger the default internal navigation
			    return false;
			 }
			 // return true is necessary to prevent further default navigation
			 return true;
		 **/

		return false;
	},
	getPredefinedValuesForCreateExtension: function (oSmartFilterBar) {
		var oRet = {};
		/**
		var oSelectionVariant = oSmartFilterBar.getUiState().getSelectionVariant();   
		var aSelectOptions = oSelectionVariant.SelectOptions;   
		var fnTransfer = function(sFieldname){    
		    for (var i = 0; i < aSelectOptions.length; i++){     
		        var oSelectOption = aSelectOptions[i];     
		        if (oSelectOption.PropertyName === sFieldname){      
		            if (oSelectOption.Ranges.length === 1){       
		                var oFilter = oSelectOption.Ranges[0];       
		                if (oFilter.Sign === "I" && oFilter.Option === "EQ"){        
		                    oRet[sFieldname] = oFilter.Low;       
		                }      
		            }      
		            break;     
		        }    
		    }   
		};     
		fnTransfer("ProductCategory");   
		fnTransfer("Supplier");   
		**/
		return oRet;
	}
});