sap.ui.define(['sap/ui/core/mvc/ControllerExtension',
"sap/m/MessageToast",
], function (ControllerExtension,toast) {
	'use strict';

	return ControllerExtension.extend('com.sbp.emplistfiori.ext.controller.ListReport', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf com.sbp.emplistfiori.ext.controller.ListReport
			 */
			onInit: function () {
			},
			onAfterRendering: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				// var oModel = this.base.getExtensionAPI().getModel("eModel");
				// document.getElementById("com.sbp.emplistfiori::Interactions_HeaderList--fe::FilterBar::Interactions_Header-btnSearch")
				// .addEventListener('click',function(evt){
				// 	localStorage.setItem("goPress",true);
				// 		var origOpen = XMLHttpRequest.prototype.open;
				// 		XMLHttpRequest.prototype.open = function() {
				// 	this.addEventListener('load', function() {
				// 		if(localStorage.getItem("goPress")){
				// 			var response = this.responseText;
				// 			if(response){
				// 				response = response.split("value")[1].replace(":",'').split("--batch")[0].replace('"','').split("]}")[0];
				// 			}
				// 			var aData = JSON.parse(response+"]");
				// 			localStorage.removeItem("goPress")
				// 			console.log("Server response:", aData);
				// 		}
				// 			});
				// 			origOpen.apply(this, arguments);
				// 		};


				// })
				
				//Adding event listener to listen whenever Route changes
				// window.addEventListener('hashchange', function (evt) {
				// 	if (evt.newURL.includes("Interactions_Header")) { //if its object Page
				// 		setTimeout(() => {
				// 			var aInput = document.getElementsByTagName("input");
				// 			if (aInput) {
				// 				// var oControl = Array.from(aInput).find(ele => ele.id.toString().includes('empID'));
				// 				var oControl = Array.from(aInput).find(ele=>ele.id.toString().includes('phone'));
				// 				if (oControl) {
				// 					oControl.addEventListener("keydown", function (e) {
				// 						if (e.key == 'F4') { //For F4 press handler 
				// 							var sId = e.target.id;
				// 							if (sId.includes('phone')) { //if its phoneNumber field(name is from entity) on which f4 is pressed
				// 								var sEmpNameId = sId.replace("phone", "empName"); //getting Id of empName control for which validation to be checked
				// 								var sEmpName = document.getElementById(sEmpNameId).value;
				// 								sEmpName = (sEmpName) ? sEmpName : '';
				// 								if (sEmpName.trim() == '') { //if employee Name is empty
				// 									e.stopPropagation(); //overriding default F4 model open functionality
				// 									e.preventDefault();
				// 									return toast.show("Please Enter Employee Name"); //static ,use from i18n
				// 								}
				// 							}
				// 						}
				// 					})
				// 				}
				// 			}
				// 			//for button 
				// 			// var aSpans = document.getElementsByTagName("span");
				// 			// if (aSpans) {
				// 			// 	var aButtons = Array.from(aSpans).filter(ele => ele.id.toString().includes('empID'));
				// 			// 	if (aButtons) {
				// 			// 		aButtons[aButtons.length - 1].addEventListener("click", function (e) {
				// 			// 			var sId = e.target.id;
				// 			// 			if (sId.includes('empID')) { //if its empID field(name is from entity) on which f4 is pressed
				// 			// 				var sEmpNameId = sId.replace("empID", "empName"); //getting Id of empName control for which validation to be checked
				// 			// 				var sEmpName = document.getElementById(sEmpNameId).value;
				// 			// 				sEmpName = (sEmpName) ? sEmpName : '';
				// 			// 				if (sEmpName.trim() == '') { //if employee Name is empty
				// 			// 					e.stopPropagation(); //overriding default F4 model open functionality
				// 			// 					e.preventDefault();
				// 			// 					return toast.show("Please Enter Employee Name"); //static ,use from i18n
				// 			// 				}
				// 			// 			}
				// 			// 		})
				// 			// 	}
				// 			// }
				// 		}, 1000);
				// 	}
				// });
			},
		}
	});
});