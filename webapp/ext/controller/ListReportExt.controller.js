sap.ui.controller("com.capita.cpm.poc.zmanagecontract.ext.controller.ListReportExt", {
	onBindUnBindClick: function(oEvent){
		var oSelectedContexted = this.extensionAPI.getSelectedContexts()[0];
		if (oSelectedContexted){
			// Check whether its locked, if so unlock otherwise lock.
			var sPath = this.extensionAPI.getSelectedContexts()[0].sPath;
			var bLocked = this.getView().getModel().getProperty(sPath + "/Locked");
			if (bLocked){
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
		} else{
			sap.m.MessageToast.show("Please select a sales contract");			
		}
	},
	onSalesOrderCreateWizard: function(oEvent){
	 	/**
		var bEditable = oEvent.getSource().getModel("ui").getProperty("/editable");
		var aSelectedContext = this.extensionAPI.getSelectedContexts("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
		if ( !bEditable || aSelectedContext.length < 1) {
			return;
		}
		//var sPath = aSelectedContext[0].sPath;
		var oContext = aSelectedContext[0];
		var oExtensionAPI = this.extensionAPI;

		var oModel = oEvent.getSource().getModel();
		**/
    		var _oDialog = sap.ui.xmlfragment("SalesOrderWizardCreateDialog", "com.capita.cpm.poc.zmanagecontract.ext.fragments.SalesOrderWizardCreate", {
    			
    			onCancelPress: function(e) {
                    oModel.refresh(true);
                	_oDialog.close();
      			}
    		});
    		
        	// bind the model to the dialog
        	//_oDialog.setBindingContext(oContext); //aResponse.context);
        	
        	// show the dialog
    		this.extensionAPI.attachToView(_oDialog);
    		_oDialog.open();
    		
		    // update the model so the lists are up to date
			//oModel.refresh(true);
		
    },
	onBeforeRebindTableExtension: function(oEvent){
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
	onListNavigationExtension: function(oEvent) {
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
	getPredefinedValuesForCreateExtension: function(oSmartFilterBar){   
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