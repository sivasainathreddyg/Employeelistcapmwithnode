sap.ui.define(["sap/m/MessageToast"], function (toast) {
  "use strict";
  /*Reusable Function should be declared here and the keyword "this" doesn't refer to sapui5/Fiori,
  but refers to JavaScript 
  */
  //#region Batch Create Fragment -JS 
  window.handleLiveChange = function (oEvent) {
    oEvent.getSource().setProperty('valueState', 'None');
  }
  window.addTableRow = function (that) {
    var oTable = sap.ui.getCore().byId("employeeTable");
    var iItemsLen = oTable.getItems().length;
    var oModel = that.getModel("eModel");
    if (iItemsLen != 0) {
      var bIsValid = true;
      //If mandatory fields are not entered,don't add new row
      oTable.getItems().forEach(el => {
        if (!el.getCells()[0].getValue().trim()) {
          el.getCells()[0].setProperty('valueState', 'Error');
          bIsValid = false;
        }
        if (!el.getCells()[1].getValue().trim()) {
          el.getCells()[1].setProperty('valueState', 'Error');
          bIsValid = false;
        }
      })
      if (!bIsValid) {
        return;
      }
    }
    var oCell1 = new sap.m.Input({
      showValueHelp: true,
      type: "Number",
      id: "empID_" + iItemsLen,
      liveChange: function (oEvent) {
        handleLiveChange(oEvent);
      },
      valueHelpRequest: function () {
        valueHelp(oModel, that, "empID_" + iItemsLen);
      }
    });
    var oCell2 = new sap.m.Input({
      showValueHelp: true,
      id: "empName_" + iItemsLen,
      liveChange: function (oEvent) {
        handleLiveChange(oEvent);
      },
      valueHelpRequest: function () {
        valueHelp(oModel, that, "empName_" + iItemsLen);
      }
    });
    var oCell3 = new sap.m.Input({
      type: "Number"
    });

    if (iItemsLen != 0) { //Add Remove Button
      var oCell4 = new sap.m.Button({
        icon: "sap-icon://delete",
        type: "Reject",
        tooltip: "Remove",
        press: function (oEvent) {
          oTable.removeItem(oEvent.getSource().getParent()).destroy();
        }
      })
      var oItem = new sap.m.ColumnListItem({
        cells: [oCell1, oCell2, oCell3, oCell4]
      });
    } else {
      var oItem = new sap.m.ColumnListItem({
        cells: [oCell1, oCell2, oCell3]
      });
    }
    oTable.addItem(oItem);
    setTimeout(() => {
      oTable.getItems()[0].getCells()[0].focus();
    }, 300);
  }
  window.valueHelp = function (oModel, that, flag) {
    oModel.read("/Interactions_Header", {
      success: function (data) {
        if (!that.byId("valueHelpDialog")) { //Opening valueHelp Fragment
          that.ovalueHelpDialogFragment = that.loadFragment({
            name: "com.sbp.emplistfiori.fragments.valueHelp"
          })
          that.ovalueHelpDialogFragment.then(function (oDialog) {
            oDialog.open();
            oDialog.attachBrowserEvent("keydown", function (oEvent) {
              if (oEvent.key == "Escape") {
                oEvent.stopPropagation();
                oEvent.preventDefault();
              }
            })
          })
        } else {
          that.byId("valueHelpDialog").open();
        }
        localStorage.setItem("selection", flag)
        var tModel = new sap.ui.model.json.JSONModel();
        tModel.setData({
          empInfoData: data.results
        })
        setTimeout(() => {
          sap.ui.getCore().byId("empInfoList").setModel(tModel);
        }, 500);
      },
      error: function (ex) {
        console.log(ex)
      }
    })
  }
  //#endregion
  return {
    openFragment: function () {
      if (!this.byId("openDialog")) {
        this.oDialogFragment = sap.ui.xmlfragment(
          "com.sbp.emplistfiori.fragments.addEmployee",
          this
        );
        var i18nModel = new sap.ui.model.resource.ResourceModel({
          bundleUrl: "i18n/i18n_en.properties",
        });
        this.oDialogFragment.setModel(i18nModel, "i18n"); //setting i18n to addEmployee fragment
        this.oDialogFragment.open();
      } else {
        this.byId("openDialog").open();
      }
    },
    edit: function (oEvent) {//Table Edit icon click
      var oSelRec = oEvent.getSource().getBindingContext().getObject(); //getting selected record
      if (oSelRec) {
        if (!this.byId("openDialog")) {
          this.oDialogFragment = sap.ui.xmlfragment("com.sbp.emplistfiori.fragments.addEmployee", this);
          var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: "i18n/i18n_en.properties"
          });
          this.oDialogFragment.setModel(i18nModel, "i18n");
          this.oDialogFragment.open();
        } else {
          this.byId("openDialog").open();
        }
        //Setting Values to fields in addEmployee Fragment
        sap.ui.getCore().byId("txtEmpID").setValue(oSelRec.empID).setEnabled(false);
        sap.ui.getCore().byId("resetBtn").setEnabled(false);
        sap.ui.getCore().byId("txtEmpName").setValue(oSelRec.empName).focus();
        sap.ui.getCore().byId("txtPhone").setValue(oSelRec.phone);
        var button = sap.ui.getCore().byId("radio_" + oSelRec.priority_code); //find the button
        sap.ui.getCore().byId("priorityGrp").setSelectedButton(button);
        sap.ui.getCore().byId("empTogglebtn").setText(this.getModel("i18n").getProperty("update"));
        sap.ui.getCore().byId("fragmentTitle").setText(this.getModel("i18n").getProperty("fragmentEditTitle"));
      }
    },
    closeFragment: function () {
      if (this.oDialogFragment) {
        this.oDialogFragment.close();
        this.oDialogFragment.destroy(true);
      }
    },
    reset: function () {
      //clearing controls in addEmployee Fragment
      sap.ui.getCore().byId("txtEmpID").setValue("").focus();
      sap.ui.getCore().byId("txtEmpName").setValue("");
      sap.ui.getCore().byId("txtPhone").setValue("");
      var button = sap.ui.getCore().byId("radio_High"); //find the button
      sap.ui.getCore().byId("priorityGrp").setSelectedButton(button);
    },
    empSaveUpdate: function () {
      var that = this;
      var iId = sap.ui.getCore().byId("txtEmpID").getValue();
      var sName = sap.ui.getCore().byId("txtEmpName").getValue();
      var sPhone = sap.ui.getCore().byId("txtPhone").getValue();
      if (sName.toString().trim() == "" || iId.toString().trim() == "") {
        //validation for required fields
        return toast.show(this.getModel("i18n").getProperty("reqFields"));
      }
      //finding selected Radio button from radio button Group
      var sPriority = sap.ui.getCore().byId("priorityGrp").getSelectedButton()
        .mProperties["text"];
      var iCriticality = 1;
      if (sPriority != "High") {
        sPriority == "Medium" ? (iCriticality = 2) : (iCriticality = 3);
      }
      if (sap.ui.getCore().byId("empTogglebtn").getText() == "Save") {
        var employeeData = [];
        const oEmployee = {
          empID: iId,
          empName: sName,
          phone: sPhone,
          priority_code: sPriority,
          criticality: iCriticality,
        };
        employeeData.push(oEmployee);
        var oModel = this.getModel("eModel");
        oModel.callFunction("/saveEmployees", {
          method: "GET",
          urlParameters: {
            employees: JSON.stringify(employeeData),
          },
          success: function () {
            sap.ui.core.BusyIndicator.hide();
            toast.show(that.getModel("i18n").getProperty("saved"));
            that.oDialogFragment.close();
            that.oDialogFragment.destroy(true);
            that
              .byId(
                "com.sbp.emplistfiori::Interactions_HeaderList--fe::FilterBar::Interactions_Header-btnSearch"
              )
              .firePress();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            toast.show(JSON.parse(error.responseText).error.message.value);
          },
        });
      } else {
        var oModel = this.getModel("eModel");
        sap.ui.core.BusyIndicator.show();
        oModel.callFunction("/updateEmployee", {
          method: "GET",
          urlParameters: {
            eId: iId,
            eName: sName,
            ePhone: sPhone,
            priority: sPriority,
            criticality: iCriticality,
          },
          success: function () {
            toast.show(that.getModel("i18n").getProperty("updated"));
            sap.ui.core.BusyIndicator.hide();
            that.oDialogFragment.close();
            that.oDialogFragment.destroy(true);
            that
              .byId(
                "com.sbp.emplistfiori::Interactions_HeaderList--fe::FilterBar::Interactions_Header-btnSearch"
              )
              .firePress();
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            toast.show(JSON.parse(error.responseText).error.message.value);
          },
        });
      }
    },
    Back: function () {
      window.history.back();
    },
    //#region Batch Create Fragment
    batchCreate: function () {
      if (!this.byId("empDialog")) { //Opening batchCreateEmployee Fragment
        this.oEmpDialogFragment = sap.ui.xmlfragment(
          "com.sbp.emplistfiori.fragments.batchCreateEmployee",
          this
        );
        var i18nModel = new sap.ui.model.resource.ResourceModel({
          bundleUrl: "i18n/i18n_en.properties",
        });
        this.oEmpDialogFragment.setModel(i18nModel, "i18n"); //setting i18n to addEmployee fragment
        this.oEmpDialogFragment.open();
        this.oEmpDialogFragment.attachBrowserEvent("keydown", function (oEvent) {
          if (oEvent.key == "Escape") {
            oEvent.stopPropagation();
            oEvent.preventDefault();
          }
        });
        ////Add First Row
        addTableRow(this)
      } else {
        this.byId("empDialog").open();
      }
    },
    AddRow: function () {
      addTableRow(this);
    },
    batchSave: function () {
      var oTable = sap.ui.getCore().byId("employeeTable");
      var employeeData = [];
      Array.from(oTable.getItems()).forEach(el => {
        //Pushing into array only if mandatory fields are entered
        var iEmpID = el.getCells()[0].getValue();
        var sEmpName = el.getCells()[1].getValue();
        if (iEmpID.trim() != '' && sEmpName.trim() != '') {
          const oEmployee = {
            empID: el.getCells()[0].getValue(),
            empName: el.getCells()[1].getValue(),
            phone: el.getCells()[2].getValue(),
            priority_code: "High",
            criticality: 1,
          };
          employeeData.push(oEmployee);
        }
      })
      if (employeeData.length == 0) {
        return toast.show("Please Enter Required Fields")
      }
      var oModel = this.getModel("eModel");
      var that = this;
      oModel.callFunction("/saveEmployees", {
        method: "GET",
        urlParameters: {
          employees: JSON.stringify(employeeData),
        },
        success: function () {
          sap.ui.core.BusyIndicator.hide();
          toast.show(that.getModel("i18n").getProperty("saved"));
          that.oEmpDialogFragment.close();
          that.oEmpDialogFragment.destroy(true);
          //static Go button ID
          that
            .byId(
              "com.sbp.emplistfiori::Interactions_HeaderList--fe::FilterBar::Interactions_Header-btnSearch"
            )
            .firePress();
        },
        error: function (error) {
          sap.ui.core.BusyIndicator.hide();
          toast.show(JSON.parse(error.responseText).error.message.value);
        },
      });
    },
    closeEmpFragment: function () {
      if (this.oEmpDialogFragment) {
        this.oEmpDialogFragment.close();
        this.oEmpDialogFragment.destroy(true);
        localStorage.removeItem("selection");
      }
    },
    //#endregion
    closeEmpInfoFragment: function () {
      if (this.ovalueHelpDialogFragment) {
        this.ovalueHelpDialogFragment.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy(true);
        })
        localStorage.removeItem("selection")
      }
    },
    selectRecord: function (oEvent) {
      var oselectedEmp = oEvent.getSource().getSelectedItem()
      var sSelection = localStorage.getItem("selection");
      if (sSelection) {
        //if whole row data should bind based on selection,use this code
        // var iEmpID = oselectedEmp.getProperty('title');
        // var sName = oselectedEmp.getProperty('description');
        // var irowIndex = sSelection.split('_')[1]
        // sap.ui.getCore().byId("empID_"+irowIndex).setValue(iEmpID).setProperty('valueState','None');
        // sap.ui.getCore().byId("empName_"+irowIndex).setValue(sName).setProperty('valueState','None');

        //use below code for individual selection of input fields
        if (sSelection.includes('empID')) {
          var iEmpID = oselectedEmp.getProperty('title');
          sap.ui.getCore().byId(sSelection).setValue(iEmpID).setProperty('valueState', 'None');
        } else {
          var sName = oselectedEmp.getProperty('description');
          sap.ui.getCore().byId(sSelection).setValue(sName).setProperty('valueState', 'None');
        }
        this.ovalueHelpDialogFragment.then(function (oDialog) {
          oDialog.close();
          oDialog.destroy(true);
        })
        localStorage.removeItem("selection")
      }
    }
  };
});