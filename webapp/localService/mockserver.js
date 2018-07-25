sap.ui.define([
	"sap/ui/core/util/MockServer",
	"com/capita/cpm/poc/zmanagecontract/localService/lib/fuse"
], function (MockServer, Fuse) {
	"use strict";
	var oMockServer,
		_sAppModulePath = "com/capita/cpm/poc/zmanagecontract/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

	return {

		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function () {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				sEntity = "A_SalesOrder",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oDataSource = oManifest["sap.app"].dataSources,
				oMainDataSource = oDataSource.mainService,
				sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
				aAnnotations = oMainDataSource.settings.annotations;

			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			});

			// load local mock data
			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});
			
			/**
			oMockServer.attachAfter(MockServer.HTTPMETHOD.GET, function (oEvent) {
				//debugger;
				var oXhr = oEvent.getParameter("oXhr");
				var oUrlParams = new URLSearchParams(oXhr.url);
				var sSearch = oUrlParams.has("search") ? oUrlParams.get("search") : "";
				if (sSearch) {
					var oFilteredData = oEvent.getParameter("oFilteredData");
					var aEntities =
						oFilteredData.results.length ?
						oFilteredData.results : oMockServer.getEntitySetData(sEntity);
					var oFuse = new Fuse(aEntities, {
						threshold: 0.0, // require a perfect match
						keys: oUrlParams.has("$select") ?
							oUrlParams.get("$select").split(",") : null
					});
					oFilteredData.results = oFuse.search(oUrlParams.get("search"));
				}
			}, sEntity);

			oMockServer.attachAfter(MockServer.HTTPMETHOD.PUT, function (oEvent) {
				//debugger;
			}, sEntity);

			oMockServer.attachAfter(MockServer.HTTPMETHOD.POST, function (oEvent) {
				//debugger;
			}, sEntity);

			oMockServer.attachAfter(MockServer.HTTPMETHOD.DELETE, function (oEvent) {
				//debugger;
			}, sEntity);
			
			oMockServer.attachAfter(MockServer.HTTPMETHOD.MERGE, function (oEvent) {
				//debugger;
			}, sEntity);
			
			oMockServer.attachAfter(MockServer.HTTPMETHOD.PATCH, function (oEvent) {
				//debugger;
			}, sEntity);			
			**/
			var aRequests = oMockServer.getRequests(),
				fnResponse = function (iErrCode, sMessage, aRequest) {
					aRequest.response = function (oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			// handling the metadata error test
			if (oUriParameters.get("metadataError")) {
				aRequests.forEach(function (aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function (aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}
			oMockServer.start();

			jQuery.sap.log.info("Running the app with mock data");

			if (aAnnotations && aAnnotations.length > 0) {
				aAnnotations.forEach(function (sAnnotationName) {
					var oAnnotation = oDataSource[sAnnotationName],
						sUri = oAnnotation.uri,
						sLocalUri = jQuery.sap.getModulePath(_sAppModulePath + oAnnotation.settings.localUri.replace(".xml", ""), ".xml");

					///annotiaons
					new MockServer({
						rootUri: sUri,
						requests: [{
							method: "GET",
							path: new RegExp(""),
							response: function (oXhr) {
								jQuery.sap.require("jquery.sap.xml");

								var oAnnotations = jQuery.sap.sjax({
									url: sLocalUri,
									dataType: "xml"
								}).data;

								oXhr.respondXML(200, {}, jQuery.sap.serializeXML(oAnnotations));
								return true;
							}
						}]

					}).start();

				});
			}

		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer}
		 */
		getMockServer: function () {
			return oMockServer;
		}
	};

});