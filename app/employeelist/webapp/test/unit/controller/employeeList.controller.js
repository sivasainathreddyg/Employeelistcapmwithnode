/*global QUnit*/

sap.ui.define([
	"comsbp/employeelist/controller/employeeList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("employeeList Controller");

	QUnit.test("I should test the employeeList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
