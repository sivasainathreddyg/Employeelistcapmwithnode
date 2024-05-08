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
           that.getEmployeeData();
        },

        getEmployeeData: function () {  
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Employees", {
                urlParameters: {
                    $expand: "orders"
                },
                success: function(data) {
                    console.log("Employees with order data:", data);
                    var jsonModel=new sap.ui.model.json.JSONModel(data.results);
                    that.getView().byId("tabContainer").setModel(jsonModel);
                },
                error: function(err) {
                    console.error("Error reading Employees with Orders:", err);
                }
            });
        },  
        //     oModel.read("/Employees?$expand=orders", {
        //         success: function (oData) {
        //             // Set the data to the model
        //             //that.getView().getModel().setData(oData);
        //             var jsonModel = new sap.ui.model.json.JSONModel(oData.results);
        //             that.getView().byId("tabContainer").setModel(jsonModel);
        //         },
        //         error: function (error) {
        //             // Handle error
        //             console.error("Error fetching employee data:", error);
        //         }
        //     });
        // },
        
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
        // addNewButtonPressHandler : function() {
        //     var newEmployee = new TabContainerItem({
        //         name: "New employee",
        //         employeeId:"New EmployeeID"
        //     });

        //     var tabContainer = this.byId("tabContainer");

        //     tabContainer.addItem(
        //         newEmployee
        //     );
        //     tabContainer.setSelectedItem(
        //         newEmployee
        //     );
        // },
        addNewButtonPressHandler: function() {
            if (!that._oDialog) {
                that._oDialog = sap.ui.xmlfragment("com.employeeorder.Fragments.Employeedetails", that);
            }
            that._oDialog.open();
        },
        oncloseE:function(){
            this.oView=sap.ui.xmlfragment("com.employeeorder.Fragments.Employeedetails",that)
            that._oDialog.close();
        },
        onsubmitemployeedetails:function(){
            var obj={}
            obj.employeeId=sap.ui.getCore().byId('empid').getValue();
            obj.name=sap.ui.getCore().byId('empname').getValue();
            obj.city=sap.ui.getCore().byId('empcity').getValue();
            var oModel=this.getOwnerComponent().getModel();
            oModel.create("/Employees",obj,{
                success:function(odata){
                    that.oncloseE();
                    sap.m.MessageToast("Data sucessfully Added");
                    //that.getEmployeeData();
                }.bind(this),
                error:function(err){
                    console.log(err)
                }
            })
        },
        onAddorderdetails: function() {
            if (!that._oDialog) {
                that._oDialog = sap.ui.xmlfragment("com.employeeorder.Fragments.Orderitems", that);
            }
            that._oDialog.open();
        },
        onCloseO:function(){
            this.oView=sap.ui.xmlfragment("com.employeeorder.Fragments.Orderitems",that)
            that._oDialog.close();
        },
        onsubmitorderdetails:function(){
            var obj={}
            obj.orderId=sap.ui.getCore().byId('orderId').getValue();
            obj.employeeId_employeeId=sap.ui.getCore().byId('empid').getValue();
            obj.orderName=sap.ui.getCore().byId('orderName').getValue();
            obj.orderPrice=sap.ui.getCore().byId('orderPrice').getValue();
            var oModel=this.getOwnerComponent().getModel();
            oModel.create("/Orders",obj,{
                success:function(odata){
                   that.oncloseO();
                   sap.m.MessageToast("Data sucessfully Added");
                   //that.getEmployeeData();
               }.bind(this),
               error:function(err){
                   console.log(err);
                }
            })

        }
        // onsubmitorderdetails: function() {
        //     var orderId = sap.ui.getCore().byId('orderId').getValue();
        //     var employeeId = sap.ui.getCore().byId('empid').getValue(); // This should be the ID of the associated employee
        //     var orderName = sap.ui.getCore().byId('orderName').getValue();
        //     var orderPrice = sap.ui.getCore().byId('orderPrice').getValue();
        //     var obj = {
        //         orderId: orderId,
        //         employeeId: employeeId,
        //         orderName: orderName,
        //         orderPrice: orderPrice
        //     };
        
        //     var that = this; // Store the reference to 'this' for later use
            
        //     var oModel = this.getOwnerComponent().getModel();
        //     oModel.create("/Orders", obj, {
        //         success: function(odata) {
        //             that.onCloseO(); // Assuming 'onCloseO' closes the dialog or performs some cleanup
        //             sap.m.MessageToast.show("Data successfully Added"); // Use 'show' method to display the message toast
        //         },
        //         error: function(err) {
        //             console.error(err);
        //         }
        //     });
        // }
        
        
    });
});
