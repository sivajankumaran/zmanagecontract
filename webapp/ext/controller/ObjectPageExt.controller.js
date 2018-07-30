sap.ui.controller("com.capita.cpm.poc.zmanagecontract.ext.controller.ObjectPageExt", {
	onClickActionA_SalesOrderSections1: function (oEvent) {},
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

	 handleKeyChange: function(oEvent) {
		debugger;
	 },
		
	 handleDateChange: function(oEvent) {
		debugger;
	 },
	 
	 handleValidFromChange: function(oEvent) {
		debugger;
	 },
	 
	 onInit: function(){
	 	// Attach methods.
	 	debugger; 
	 	this.extensionAPI.getTransactionController().attachAfterCancel(this.onAfterCancel);
	 	this.extensionAPI.getTransactionController().attachAfterDelete(this.onAfterDelete);
	 	this.extensionAPI.getTransactionController().attachAfterLineItemDelete(this.onAfterLineItemDelete);	 	
	 	this.extensionAPI.getTransactionController().attachAfterSave(this.onAfterSave);	 	
	 	this.extensionAPI.getTransactionController().registerUnsavedDataCheckFunction( function(){
	 		debugger; 
	 		return false;
	 	});
	 },
	 
	 onAfterCancel: function(oEvent){
		debugger;	
	 },

	 onAfterDelete: function(oEvent){
		debugger;	
	 },

	 onAfterLineItemDelete: function(oEvent){
		debugger;	
	 },	 

	 onAfterSave: function(oEvent){
		oEvent.saveEntityPromise.then( function(){ 
			alert('done');
		});	
	 },
	 
	 onSalesOrderItemEditClick: function(oEvent){
	 	debugger;
		var bEditable = oEvent.getSource().getModel("ui").getProperty("/editable");
		var aSelectedContext = this.extensionAPI.getSelectedContexts("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
		if ( !bEditable || aSelectedContext.length < 1) {
			return;
		}
		//var sPath = aSelectedContext[0].sPath;
		var oContext = aSelectedContext[0];
		var oExtensionAPI = this.extensionAPI;

		var oModel = oEvent.getSource().getModel();
		
    		var _oDialog = sap.ui.xmlfragment("SalesOrderItemCreateDialog", "com.capita.cpm.poc.zmanagecontract.ext.fragments.SalesOrderItemCreate", {
    			
    			onUpdatePress: function(e) {
                    oModel.refresh(true);
                	_oDialog.close();
      			}
    		});
        	// bind the model to the dialog
        	_oDialog.setBindingContext(oContext); //aResponse.context);
        	
        	// show the dialog
    		oExtensionAPI.attachToView(_oDialog);
    		_oDialog.open();
    		
		    // update the model so the lists are up to date
			oModel.refresh(true);
		
	 }
	 
});