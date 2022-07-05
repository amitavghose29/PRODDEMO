/*global QUnit*/

sap.ui.define([
	"comproddemo/proddemo/controller/ProdList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ProdList Controller");

	QUnit.test("I should test the ProdList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
