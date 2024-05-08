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

        },
        onSearch: function(oEvent) {
            // Get the search value entered by the user
            var sSearchValue = parseInt(oEvent.getSource().getValue());
        
            // If the search value is empty, reset the table to show all orders
            if (!sSearchValue) {
                this.fetchAllOrders();
                return;
            }
        
            // Filter the orders based on the search value
            this.filterOrdersByOrderId(sSearchValue);
        },
        
        fetchAllOrders: function() {
            // Fetch all orders and display them in the table
            var oModel = this.getView().getModel();
            var sPath = "/Orders";
            oModel.read(sPath, {
                success: function(oData) {
                    var oTableModel = new sap.ui.model.json.JSONModel(oData.results);
                    this.byId("ordersTable").setModel(oTableModel);
                }.bind(this),
                error: function(error) {
                    console.error("Error fetching orders:", error);
                }
            });
        },
        
        filterOrdersByOrderId: function(sOrderId) {
            // Filter orders by order ID
            var oModel = this.getView().getModel();
            var sPath = "/Orders(sOrderId3)";
            oModel.read(sPath, {
                success: function(oData) {
                    var oTableModel = new sap.ui.model.json.JSONModel(oData.results);
                    this.byId("ordersTable").setModel(oTableModel);
                }.bind(this),
                error: function(error) {
                    console.error("Error filtering orders by order ID:", error);
                }
            });
        }
        
        
    });
});
