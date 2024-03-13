
    sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, toast, MessageBox) {
        "use strict";
        var that;
        return Controller.extend("com.sbp.employeelist.controller.employeeList", {
            onInit: function () {
                that = this;
                that.usersData = [];
                that.setKeyboardShortcuts(); //For setting up HotKeys to Create Button
            },
            onAfterRendering: function () {
                that.employeeData = []; //Used for storing table Data 
                var oModel = that.getOwnerComponent().getModel("eModel"); //getting Global Model of oData
                // sap.ui.core.BusyIndicator.show();
                oModel.read("/Interactions_Header", {
                    success: function (data) {
                        data.results.forEach(m => m.newEmp = false);
                        that.employeeData = data.results;
                        that.bindToView(that.employeeData); //binding the Model to View
                        sap.ui.core.BusyIndicator.hide();
                    }
                })
                that.oi18n = this.getView().getModel("i18n").getResourceBundle(); //storing i18n as Global Variable
            },
            bindToView: function (aTableData) { //Binding Model to View
                var tModel = new sap.ui.model.json.JSONModel();
                tModel.setData({
                    empData: aTableData
                })
                that.getView().setModel(tModel);
            },
            //#region addEmployee Fragment
            modifyEmployee: function () {
                var iId = sap.ui.getCore().byId("txtEmpID").getValue();
                var sName = sap.ui.getCore().byId("txtEmpName").getValue();
                var sPhone = sap.ui.getCore().byId("txtPhone").getValue();
                if (sName.toString().trim() == '' || iId.toString().trim() == '') {
                    return toast.show(that.oi18n.getText("reqFields"));
                }
                if (sap.ui.getCore().byId("empTogglebtn").getText() == 'Save') { //redirecting to saveEmployee function if button is Save
                    return that.saveEmployee(parseInt(iId), sName, sPhone);
                }
                if (that.newEmpEdit) { //if selected record is newly created Employee just modifying the table items
                    let oEmpIndex = Array.from(that.employeeData).findIndex(f => f.empID == iId);
                    that.employeeData[oEmpIndex].empName = sName;
                    that.employeeData[oEmpIndex].phone = sPhone;
                    that.bindToView(that.employeeData);
                    toast.show(that.oi18n.getText("updated"))
                    that.closeDialog();
                } else {
                    var oModel = that.getOwnerComponent().getModel("eModel");
                    sap.ui.core.BusyIndicator.show();
                    oModel.callFunction("/updateEmployee", {
                        method: "GET",
                        urlParameters: {
                            eId: iId,
                            eName: sName,
                            ePhone: sPhone
                        },
                        success: function () {
                            toast.show(that.oi18n.getText("updated"))
                            that.closeDialog();
                            //To maintain the state of Table items, not calling Get request and just modifying table Items after update
                            let oEmpIndex = Array.from(that.employeeData).findIndex(f => f.empID == iId);
                            that.employeeData[oEmpIndex].empName = sName;
                            that.employeeData[oEmpIndex].phone = sPhone;
                            that.bindToView(that.employeeData);
                            sap.ui.core.BusyIndicator.hide();
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            toast.show(JSON.parse(error.responseText).error.message.value);
                        }
                    })
                }

            },
            resetClick: function () {
                sap.ui.getCore().byId("txtEmpID").setValue('').focus();
                sap.ui.getCore().byId("txtEmpName").setValue('');
                sap.ui.getCore().byId("txtPhone").setValue('');
            },
            saveEmployee: function (iId, sName, sPhone) {
                const oEmployee = {
                    empID: iId,
                    empName: sName,
                    phone: sPhone,
                    newEmp: true
                }
                that.employeeData.push(oEmployee); //New Employee Data created being pushed into Array
                that.bindToView(that.employeeData);
                that.resetClick();
                this.getView().byId("btnBatchSave").setEnabled(true); //enabling Save button for saving new Employee 
            },
            //Making PhoneNumber field to  accept only numbers as maxlength property is not applicable for number type
            numberChange: function (oEvent) {
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
                _oInput.setValue(val);
            },
            closeDialog: function () {
                if (this.oIDialogFragment) {
                    this.oIDialogFragment.close();
                    this.oIDialogFragment.destroy(true)
                }
            },
            //#endregion

            //#region Events
            batchSave: function () {
                var aNewEmployees = Array.from(that.employeeData).filter(f => f.newEmp);
                if (aNewEmployees.length > 0) {
                    var oModel = that.getOwnerComponent().getModel("eModel");
                    Array.from(aNewEmployees).forEach(m => delete m.newEmp); //removing the flag which we setUp to identify new Employee
                    sap.ui.core.BusyIndicator.show();
                    oModel.callFunction("/saveEmployees", {
                        method: "GET",
                        urlParameters: {
                            employees: JSON.stringify(aNewEmployees)
                        },
                        success: function () {
                            sap.ui.core.BusyIndicator.hide();
                            toast.show(that.oi18n.getText("saved"))
                            that.onAfterRendering();
                            that.getView().byId("btnBatchSave").setEnabled(false);
                        },
                        error: function (error) {
                            sap.ui.core.BusyIndicator.hide();
                            toast.show(JSON.parse(error.responseText).error.message.value);
                        }
                    })
                }
            },
            deleteEmployees: function () {
                var aItems = this.getView().byId('empTable').getItems();
                var aSelectedItems = [];
                var alocalItems = [];
                //Filtering the new Added Employees and Existing Employees
                aItems.forEach(el => {
                    if (el.getSelected()) {
                        let oElement = el.getBindingContext().getObject();
                        if (oElement.newEmp) {
                            alocalItems.push(oElement.empID);
                        } else {
                            aSelectedItems.push(oElement.empID);
                        }
                        
                    }
                })
                if (aSelectedItems.length == 0 && alocalItems.length == 0) {
                    return toast.show(that.oi18n.getText("deleteValidation"))
                }
                MessageBox.warning(that.oi18n.getText("deleteConfirmation"), {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction == 'OK') {
                            if (aSelectedItems.length > 0) { //If Existing Employees are selected
                                sap.ui.core.BusyIndicator.show();
                                var oModel = that.getOwnerComponent().getModel("eModel");
                                oModel.callFunction("/deleteEmployees", {
                                    method: "GET",
                                    urlParameters: {
                                        employeeIds: JSON.stringify(aSelectedItems)
                                    },
                                    success: function () {
                                        sap.ui.core.BusyIndicator.hide();
                                        toast.show(that.oi18n.getText("deleted"))
                                        sap.ui.core.BusyIndicator.hide();
                                        aSelectedItems.forEach(x => { //To preserve the state if new unsaved Employees manually removing them
                                            let iIndex = Array.from(that.employeeData).findIndex(f => f.empID == x);
                                            if (iIndex) {
                                                that.employeeData.splice(iIndex, 1);
                                            }
                                        })
                                        that.bindToView(that.employeeData);

                                    },
                                    error: function (error) {
                                        sap.ui.core.BusyIndicator.hide();
                                        toast.show(JSON.parse(error.responseText).error.message.value);
                                    },
                                })
                            }
                            if (alocalItems.length > 0) { //if Only newly added Employees are selected,Remove them from table
                                alocalItems.forEach(x => {
                                    let iIndex = Array.from(that.employeeData).findIndex(f => f.empID == x);
                                    if (iIndex) {
                                        that.employeeData.splice(iIndex, 1);
                                    }
                                })
                                that.bindToView(that.employeeData);
                                toast.show(that.oi18n.getText("deleted"))
                            }
                            if (Array.from(that.employeeData).findIndex(f => f.newEmp == true) == -1) { //disabling Save button if no new record Exists
                                that.getView().byId("btnBatchSave").setEnabled(false);
                            }
                        }
                    }
                });
            },
            removeEmployee: function (oEvent) { //removing only newly Added Employees
                var sEmpID = oEvent.getSource().oParent.oParent.getCells()[0].getProperty('text');
                let iIndex = Array.from(that.employeeData).findIndex(f => f.empID == sEmpID);
                that.employeeData.splice(iIndex, 1);
                that.bindToView(that.employeeData);
                if (Array.from(that.employeeData).findIndex(f => f.newEmp == true) == -1) {
                    this.getView().byId("btnBatchSave").setEnabled(false);
                }
            },
            search: function () {
                var aTableItems = this.getView().byId('empTable').getItems();
                var sEmpSearch = this.getView().byId("txtSearch").getValue();
                if (sEmpSearch.toString().trim() != '' && aTableItems.length > 0) {
                    var afilteredData = [];
                    //Filtering both search field equals to EmployeeId and starts with EmployeeName.
                    aTableItems.forEach(el => {
                        let oElement = el.getBindingContext().getObject();
                        if (oElement.empID == sEmpSearch || oElement.empName.toLowerCase().startsWith(sEmpSearch.toLowerCase())) {
                            afilteredData.push(el.getBindingContext().getObject());
                        }
                    })
                    that.bindToView(afilteredData);
                } else if (sEmpSearch.toString().trim() == "") {
                    that.bindToView(that.employeeData);
                }
                document.getElementById('form')
            },
            createEmployees: function () {//opening addEmployee Fragment
                if (!this.byId("openDialog")) {
                    this.oIDialogFragment = sap.ui.xmlfragment("com.sbp.employeelist.fragments.addEmployee", this.getView().getController());
                    this.getView().addDependent(this.oIDialogFragment);
                    this.oIDialogFragment.open();
                    //To prevent Fragment Close on Escape Key Press
                    this.oIDialogFragment.attachBrowserEvent("keydown", function (oEvent) {
                        if (oEvent.key == "Escape") {
                            oEvent.stopPropagation();
                            oEvent.preventDefault();
                        }
                    });
                } else {
                    this.byId("openDialog").open();
                }
            },
            editClick: function (oEvent) {
                that.newEmpEdit = false; //A flag to identify whether the new record is selected or not
                var sEmpID = oEvent.getSource().oParent.oParent.getCells()[0].getProperty('text');
                let oSelRec = Array.from(that.employeeData).find(f => f.empID == sEmpID);
                if (oSelRec) {
                    that.createEmployees();
                    sap.ui.getCore().byId("txtEmpID").setValue(oSelRec.empID).setEnabled(false);
                    sap.ui.getCore().byId("resetBtn").setEnabled(false);
                    sap.ui.getCore().byId("txtEmpName").setValue(oSelRec.empName).focus();
                    sap.ui.getCore().byId("txtPhone").setValue(oSelRec.phone);
                    sap.ui.getCore().byId("empTogglebtn").setText(that.oi18n.getText("update"));
                    sap.ui.getCore().byId("fragmentTitle").setText(that.oi18n.getText("fragmentEditTitle"));
                    if (oSelRec.newEmp) { //if edited Record is new Employee yet to be Saved,setting flag to true
                        that.newEmpEdit = true;
                    }
                }
            },
            setKeyboardShortcuts: function () {
                $(document).keydown($.proxy(function (e) {
                    switch (e.ctrlKey && e.altKey && e.keyCode) {
                        case 67:///Open Add Employee Dialog on Ctrl+Alt+c 
                            if (!$('#openDialog').html()) {
                                that.createEmployees();
                            }
                            break;
                    }
                }))
            },
            DataFromApi:function(){
 // var test =  new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
                // console.log(test);
                // console.log( sap.ushell.Container.getService("UserInfo"))
                // var url ="/v3/users";
                var url ="https://e1b9bff8-73aa-4f8b-8ce3-b94fd1e21a5c.accounts.ondemand.com/v3/users";
                // var url2="https://e1b9bff8-73aa-4f8b-8ce3-b94fd1e21a5c.accounts.ondemand.com/v3/organizations"
                var   token = "eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vdWFhLmNmLnVzMTAtMDAxLmhhbmEub25kZW1hbmQuY29tL3Rva2VuX2tleXMiLCJraWQiOiJrZXktMSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMjRiNDgwZWUwNWU0YmUxYTE4NTRkMzA0ZDlhYjc4ZiIsInN1YiI6Ijk1Nzg3MDcwLTRlY2QtNDk1My1iNzBmLTIxNzI2OWY2MjIzNCIsInNjb3BlIjpbIm9wZW5pZCIsInVhYS51c2VyIiwiY2xvdWRfY29udHJvbGxlci5yZWFkIiwicGFzc3dvcmQud3JpdGUiLCJjbG91ZF9jb250cm9sbGVyLndyaXRlIl0sImNsaWVudF9pZCI6ImNmIiwiY2lkIjoiY2YiLCJhenAiOiJjZiIsImdyYW50X3R5cGUiOiJwYXNzd29yZCIsInVzZXJfaWQiOiI5NTc4NzA3MC00ZWNkLTQ5NTMtYjcwZi0yMTcyNjlmNjIyMzQiLCJvcmlnaW4iOiJzYXAuaWRzIiwidXNlcl9uYW1lIjoic2hhcmllZmFoYW1lZEBzYnBjb3JwLmluIiwiZW1haWwiOiJzaGFyaWVmYWhhbWVkQHNicGNvcnAuaW4iLCJhdXRoX3RpbWUiOjE2NzU2Njc2NDIsInJldl9zaWciOiI3YTMyOWZjMCIsImlhdCI6MTY3NTY2NzY0MiwiZXhwIjoxNjc1NjY4ODQyLCJpc3MiOiJodHRwczovL3VhYS5jZi51czEwLTAwMS5oYW5hLm9uZGVtYW5kLmNvbS9vYXV0aC90b2tlbiIsInppZCI6InVhYSIsImF1ZCI6WyJjbG91ZF9jb250cm9sbGVyIiwicGFzc3dvcmQiLCJjZiIsInVhYSIsIm9wZW5pZCJdfQ.Tj-7lmdHC-eqL4GM8rIk1Dmpwi35PG94Xn6g9-WaqwpWEeec2bRnn0OdkujGAmMV6KGeI9EiAUrs1WjOKiGmUDso9FJ5U1lk6h1MlkfGefCyQHK3UMmrgIDkqHasDsD6_gEFEO9SOOIjivcaQBPbMtyOt_YuEeXuaIBiyZveaxUO076k2rW6CjW7Ir-bkJNmwGRVg6Yg9tm8m4j822pDU80O_IxPUdWAHKyuaMgqgaaKboekfGREVxpZxFPnymO3xOsBopYwENvvH0Vli-Fju5lpXgtWtTCjXvikw_GnRWrSpiY3q-ARj-jvT22GpjzlR_DTPgmC3ExyfsqTJ-x2jw"
            //     $.ajax({
            //        type: "GET",
            //        url: "https://cors-anywhere.herokuapp.com/"+ url,
            //        headers: {"Authorization":"bearer "+ token,"Access-Control-Allow-Origin":"*","X-Requested-With":"XMLHttpRequest"},
            //        success: function (result) {
            //            alert("success");
            //        },
            //        error: function (e) {
            //            console.log(e.message);
            //        }
            //    });

               var userSettings = {
                "async": true,
                "crossDomain": true,
                "url":  url,
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept": "*/*",
                    "Access-Control-Allow-Origin":"*",
                    "Cookie":""
                }
            }

            $.ajax(userSettings).done(function (response) {
                console.table(response);
            });
            //    $.ajax({
            //     url:"https://cors-anywhere.herokuapp.com/"+ url,
            //     beforeSend: function(xhr) {
            //          xhr.setRequestHeader("Authorization", `bearer ${token}`)
            //          xhr.setRequestHeader("Access-Control-Allow-Origin", `*`)
            //     }, success: function(data){
            //         alert(data);
            //         //process the JSON data etc
            //     }
        // })

        $.ajax({
            url: url,
            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", `Bearer ${token}`)
            }, success: function(data){
                alert(data);
                //process the JSON data etc
            }
    })
            },
            onF4Click:function(){
                that.usersData = [];
                var oModel = that.getOwnerComponent().getModel("eModel");
                oModel.read("/org_Users",{
                    success:function(data){
                        that.openUserFragment(data.results)
                    },
                    error:function(ex){
                        console.log(ex)
                    }
                })
            },
            synchronizeUsers:function(oEvent){
                var oModel = that.getOwnerComponent().getModel("eModel");
                var sId = oEvent.getSource().sId;
                document.getElementById(sId).classList.add('rotating');
                   oModel.callFunction("/assertUsers", {//call function to invoke nodejs 
                    method: "GET",
                    success: function () {
                         toast.show(that.oi18n.getText("userSuccess"));
                         document.getElementById(sId).classList.remove('rotating');
                    },
                    error: function (error) {
                        document.getElementById(sId).classList.remove('rotating');
                        toast.show(that.oi18n.getText("userError"));
                        console.log(error)
                    }
                })
            },
            openUserFragment:function(userData){
                that.usersData = userData;
                if (!this.byId("userDialog")) {
                    this.oUserDialogFragment = sap.ui.xmlfragment("com.sbp.employeelist.fragments.users", this.getView().getController());
                    this.getView().addDependent(this.oUserDialogFragment);
                    this.oUserDialogFragment.open();
                    //To prevent Fragment Close on Escape Key Press
                    this.oUserDialogFragment.attachBrowserEvent("keydown", function (oEvent) {
                        if (oEvent.key == "Escape") {
                            oEvent.stopPropagation();
                            oEvent.preventDefault();
                        }
                    });
                } else {
                    this.byId("userDialog").open();
                }
                var tModel = new sap.ui.model.json.JSONModel();
                tModel.setData({
                    userData: userData
                })
                sap.ui.getCore().byId("userList").setModel(tModel);
            },
            selectUsers:function(){
                var aUsersToken =[];
                var aselectedUsers = sap.ui.getCore().byId("userList").getItems().filter(el=>el.mProperties.selected == true)
               if(aselectedUsers.length == 0){
                return toast.show("Select a valid user");
               }
               aselectedUsers.forEach(x=>{
                var defToken = new sap.m.Token({
                    text: x.mProperties.title
                });
                aUsersToken.push(defToken)
            })
            that.getView().byId("userMulti").setTokens(aUsersToken)
            that.closeUser();
            },
            closeUser:function(){
                if (this.oUserDialogFragment) {
                    this.oUserDialogFragment.close();
                    this.oUserDialogFragment.destroy(true)
                }
            }
                                //  var userInterval = setInterval(() => {
                    //     var oModel = new sap.ui.model.json.JSONModel();
                    //     oModel.loadData("model/storage.json");//a json file to get response
                    //     oModel.attachRequestCompleted(function (oEvent) {
                    //         if(oEvent.getSource().oData){
                    //             clearInterval(userInterval);//removing interval 
                    //             that.openUserFragment(oEvent.getSource().oData);
                    //         }
                    //     });
                    //    }, 1000);
            //#endregion
        });
    });
