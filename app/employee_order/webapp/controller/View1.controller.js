sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/integration/widgets/Card",
    'sap/m/TabContainerItem'
],
function (Controller, JSONModel, Card,TabContainerItem) {
    "use strict";
    var that;

    return Controller.extend("com.employeeorder.controller.View1", {
        onInit: function () {
            that = this;
           this.getEmployeeData();
        //    if (!that._oDialog) {
        //     that._oDialog = sap.ui.xmlfragment("com.employeeorder.Fragments.Employeedetails", that);
        // }
        },

        getEmployeeData: function () {  
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Employees?$expand=orders", {
                success: function (oData) {
                    // Set the data to the model
                    //that.getView().getModel().setData(oData);
                    var jsonModel = new sap.ui.model.json.JSONModel(oData.results);
                    that.getView().byId("tabContainer").setModel(jsonModel);
                },
                error: function (error) {
                    // Handle error
                    console.error("Error fetching employee data:", error);
                }
            });
        },
        
        pressfunction:function(){
            
        },
        onTabItemPress: function(oEvent) {
            var oTabContainerItem = oEvent.getSource();
            var sEmployeeId = oTabContainerItem.getAdditionalText();           
            this.fetchEmployeeOrders(sEmployeeId);
        },

        fetchEmployeeOrders: function(sEmployeeId) {
            var oModel = this.getView().getModel();
            var sPath = "/Orders?$filter=employeeId eq '" + sEmployeeId + "'";

            oModel.read(sPath, {
                success: function (oData) {
                    var oTableModel = new JSONModel(oData.results);
                    this.byId("ordersTable").setModel(oTableModel);
                }.bind(this),
                error: function (error) {
                    console.error("Error fetching employee orders:", error);
                }
            });
        },
        itemCloseHandler: function(oEvent) {
            // prevent the tab being closed by default
            oEvent.preventDefault();

            var oTabContainer = this.byId("tabContainer");
            var oItemToClose = oEvent.getParameter('item');

            sap.m.MessageBox.confirm("Do you want to close the tab '" + oItemToClose.getName() + "'?", {
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        oTabContainer.removeItem(oItemToClose);
                       sap.m.MessageToast.show("Item closed: " + oItemToClose.getName(), {duration: 500});
                    } else {
                       sap.m.MessageToast.show("Item close canceled: " + oItemToClose.getName(), {duration: 500});
                    }
                }
            });
        },
        addNewButtonPressHandler : function() {
            var newEmployee = new TabContainerItem({
                name: "New employee",
                employeeId:"New EmployeeID"
            });

            var tabContainer = this.byId("tabContainer");

            tabContainer.addItem(
                newEmployee
            );
            tabContainer.setSelectedItem(
                newEmployee
            );
        },
        addNewButtonPressHandler: function() {
            
            that._oDialog.open();
        }
        
        
    });
});
