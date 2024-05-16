sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/integration/widgets/Card",
    'sap/m/TabContainerItem',
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (Controller, JSONModel, Card, TabContainerItem, DateFormat, Filter, FilterOperator
    ) {
        "use strict";
        var that;

        return Controller.extend("com.employeeorder.controller.View1", {
            formatter: {
                formatDate: function (date) {
                    if (!date) {
                        return "";
                    }
                    var oDateFormat = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                    return oDateFormat.format(date);
                }
            },
            onInit: function () {
                that = this;
                that.oModel = this.getOwnerComponent().getModel();
                that.getEmployeeData();
            },

            getEmployeeData: function () {
                // var oModel = this.getOwnerComponent().getModel();
                that.oModel.read("/Employees", {
                    urlParameters: {
                        $expand: "orders"
                    },
                    success: function (data) {
                        console.log("Employees with order data:", data);
                        var jsonModel = new sap.ui.model.json.JSONModel(data.results);
                        that.getView().byId("tabContainer").setModel(jsonModel);
                    },
                    error: function (err) {
                        console.error("Error reading Employees with Orders:", err);
                    }
                });
            },
            onTabItemPress: function (oEvent) {
                var oTabContainerItem = oEvent.getSource();
                var sEmployeeId = oTabContainerItem.getAdditionalText();
                this.fetchEmployeeOrders(sEmployeeId);
            },

            fetchEmployeeOrders: function (sEmployeeId) {
                var oModel = this.getView().getModel();
                var sPath = "/Orders?$filter=employeeId eq '" + sEmployeeId + "'";

                that.oModel.read(sPath, {
                    success: function (oData) {
                        var oTableModel = new JSONModel(oData.results);
                        this.byId("ordersTable").setModel(oTableModel);
                    }.bind(this),
                    error: function (error) {
                        console.error("Error fetching employee orders:", error);
                    }
                });
            },
            itemCloseHandler: function (oEvent) {
                // prevent the tab being closed by default
                oEvent.preventDefault();

                var oTabContainer = this.byId("tabContainer");
                var oItemToClose = oEvent.getParameter('item');

                sap.m.MessageBox.confirm("Do you want to close the tab '" + oItemToClose.getName() + "'?", {
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            oTabContainer.removeItem(oItemToClose);
                            sap.m.MessageToast.show("Item closed: " + oItemToClose.getName(), { duration: 500 });
                        } else {
                            sap.m.MessageToast.show("Item close canceled: " + oItemToClose.getName(), { duration: 500 });
                        }
                    }
                });
            },
            addNewButtonPressHandler: function () {
                if (!this._oDialogE) {
                    this._oDialogE = sap.ui.xmlfragment("com.employeeorder.Fragments.Employeedetails", this);
                }
                this._oDialogE.open();
            },
            oncloseE: function () {
                if (this._oDialogE) {
                    this._oDialogE.close();
                    this._oDialogE.destroy();
                    this._oDialogE = null; 
                }
            },            
            onsubmitemployeedetails: function () {
                var obj = {}
                obj.employeeId = sap.ui.getCore().byId('empid').getValue();
                obj.name = sap.ui.getCore().byId('empname').getValue();
                obj.city = sap.ui.getCore().byId('empcity').getValue();
                // var oModel = this.getOwnerComponent().getModel();
                that.oModel.create("/Employees", obj, {
                    success: function (odata) {
                        that.oncloseE();
                        // oModel.refresh();
                        sap.m.MessageToast.show("Data successfully added");
                        that.getEmployeeData();
                    }.bind(this),
                    error: function (err) {
                        console.log(err)
                    }
                })
            },
            onAddorderdetails: function () {
                if (!this._oDialogO) {
                    this._oDialogO = sap.ui.xmlfragment("com.employeeorder.Fragments.Orderitems", this);
                }
                this._oDialogO.open();
            },
            onCloseO: function () {
                if (this._oDialogO) {
                    this._oDialogO.close();
                    this._oDialogO.destroy();
                    this._oDialogO = null;
                }
            },            
            onsubmitorderdetails: function () {
                var obj = {}
                obj.orderId = sap.ui.getCore().byId('orderId').getValue();
                obj.employeeId_employeeId = sap.ui.getCore().byId('empid').getValue();
                obj.orderName = sap.ui.getCore().byId('orderName').getValue();
                obj.orderPrice = sap.ui.getCore().byId('orderPrice').getValue();
                obj.createdDate = sap.ui.getCore().byId('createdDate').getValue();
                // var oModel = this.getOwnerComponent().getModel();
                that.oModel.create("/Orders", obj, {
                    success: function (odata) {
                        that.onCloseO();
                        // var newData = oModel.getData().concat(odata);
                        // that.oModel.setData(newData);
                        // oModel.refresh(); // Refresh the model
                        sap.m.MessageToast.show("Data successfully added");
                        that.getEmployeeData();
                    }.bind(this),
                    error: function (err) {
                        console.log(err);
                    }
                })

            },
            onSearch: function (oEvent) {
                // Get the search value entered by the user
                var sSearchValue = parseInt(oEvent.getSource().getValue());
                var otabitemsPath = parseInt(this.byId("tabContainer").getSelectedItem().split("-")[14]);
                var aFilters = [];
                // If the search value is empty, reset the table to show all orders
                if (!sSearchValue) {
                    aFilters = [];
                    this.byId("tabContainer").mAggregations.items[otabitemsPath].mAggregations.content[1].mBindingInfos.items.binding.filter(aFilters);
                    //this.fetchAllOrders();
                    return;
                } else {
                    aFilters.push(new Filter("orderId", FilterOperator.EQ, sSearchValue));
                    //var arr = this.byId("tabContainer").getModel().getData()[otabitemsPath].orders.results.filter(order => order.orderId === sSearchValue);
                    //this.byId("tabContainer").getModel().getData()[otabitemsPath].orders.results = [];
                    //this.byId("tabContainer").getModel().getData()[otabitemsPath].orders.results = arr;
                    //this.byId("tabContainer").getModel().refresh();
                    this.byId("tabContainer").mAggregations.items[otabitemsPath].mAggregations.content[1].mBindingInfos.items.binding.filter(aFilters);
                }


                // Filter the orders based on the search value
                // this.filterOrdersByOrderId(sSearchValue);
            },
            onSearchdate:function(){
                var oView = this.getView();
                var oTable = oView.byId("ordersTable");
                var otabitemsPath = parseInt(this.byId("tabContainer").getSelectedItem().split("-")[14]);
                var oFromDate = oView.byId("fromDate").getDateValue();
                var oToDate = oView.byId("toDate").getDateValue();
                var aFilters=[]
                if(!oFromDate && oToDate){
                    aFilters=[];
                    this.byId("tabContainer").mAggregations.items[otabitemsPath].mAggregations.content[1].mBindingInfos.items.binding.filter(aFilters);
                    return
                }else{
                    aFilters.push(new Filter("createdDate", FilterOperator.BT,oFromDate,oToDate));
                    this.byId("tabContainer").mAggregations.items[otabitemsPath].mAggregations.content[1].mBindingInfos.items.binding.filter(aFilters);
                }
            },
            onDateChange:function(oEvent){
               var value= oEvent.getParameters().id.split("--")[2].split("-")[0];
               if(value==="fromDate"){
                this.getView().byId("fromDate").setValue(oEvent.getParameters().value);
                this.getView().byId("fromDate").setDateValue(oEvent.getParameters().value);
               }else{
                this.getView().byId("toDate").setValue(oEvent.getParameters().value);
                this.getView().byId("toDate").setDateValue(oEvent.getParameters().value);
               }
            },
            
            filterOrdersByOrderId: function (sOrderId) {
                // Filter orders by order ID
                var oModel = this.getView().getModel();
                var sPath = "/Orders?$filter=orderId eq " + sOrderId + "";

                oModel.read(sPath, {
                    success: function (oData) {
                        var oTableModel = new sap.ui.model.json.JSONModel(oData.results);
                        this.byId("ordersTable").setModel(oTableModel);
                    }.bind(this),
                    error: function (error) {
                        console.error("Error filtering orders by order ID:", error);
                    }
                });
            },

            fetchAllOrders: function () {
                // Fetch all orders and display them in the table
                var oModel = this.getView().getModel();
                var sPath = "/Orders";

                oModel.read(sPath, {
                    success: function (oData) {
                        var oTableModel = new sap.ui.model.json.JSONModel(oData.results);
                        this.byId("git clone ").setModel(oTableModel);
                    }.bind(this),
                    error: function (error) {
                        console.error("Error fetching orders:", error);
                    }
                });
            },
        });
    });
