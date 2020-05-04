sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, MessageBox, Fragment) {
	"use strict";

	return Controller.extend("com.accenture.MyApp.view.Orders.Orders", {

		onInit: function () {
			//this.getView().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");

			//https://dtppy3yozfqp5phd-incheckhana-node.cfapps.eu10.hana.ondemand.com/xsodata/service.xsodata/Usuario(%27AR32465339%27)?$expand=Roles,Plantas,UltimaPlanta

			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://dtppy3yozfqp5phd-incheckhana-node.cfapps.eu10.hana.ondemand.com/xsodata/service.xsodata/$metadata",
				dataType: "json",
				async: true,
				success: function (data, textStatus, jqXHR) {
					debugger
					alert("success to post");
				},
				error: function(data1, data2, data3){
					debugger;
				} 
			});
		},

		/******************Signature Pad Draw************************/

		onSign: function (oEvent) {
			var canvas = document.getElementById("signature-pad");
			var context = canvas.getContext("2d");
			canvas.width = 276;
			canvas.height = 180;
			context.fillStyle = "#fff";
			context.strokeStyle = "#444";
			context.lineWidth = 1.5;
			context.lineCap = "round";
			context.fillRect(0, 0, canvas.width, canvas.height);
			var disableSave = true;
			var pixels = [];
			var cpixels = [];
			var xyLast = {};
			var xyAddLast = {};
			var on_mousedown = function (e) {
				e.preventDefault();
				e.stopPropagation();

				canvas.addEventListener('mouseup', on_mouseup, false);
				canvas.addEventListener('mousemove', on_mousemove, false);
				canvas.addEventListener('touchend', on_mouseup, false);
				canvas.addEventListener('touchmove', on_mousemove, false);
				document.body.addEventListener('mouseup', on_mouseup, false);
				document.body.addEventListener('touchend', on_mouseup, false);

				empty = false;
				var xy = get_coords(e);
				context.beginPath();
				pixels.push('moveStart');
				context.moveTo(xy.x, xy.y);
				pixels.push(xy.x, xy.y);
				xyLast = xy;
			};
			var on_mouseup = function (e) {
				remove_event_listeners();
				disableSave = false;
				context.stroke();
				pixels.push('e');
				calculate = false;
			};
			var remove_event_listeners = function () {
				canvas.removeEventListener('mousemove', on_mousemove, false);
				canvas.removeEventListener('mouseup', on_mouseup, false);
				canvas.removeEventListener('touchmove', on_mousemove, false);
				canvas.removeEventListener('touchend', on_mouseup, false);

				document.body.removeEventListener('mouseup', on_mouseup, false);
				document.body.removeEventListener('touchend', on_mouseup, false);
			};
			var get_coords = function (e) {
				var x, y;

				if (e.changedTouches && e.changedTouches[0]) {
					var offsety = canvas.offsetTop || 0;
					var offsetx = canvas.offsetLeft || 0;

					x = e.changedTouches[0].pageX - offsetx;
					y = e.changedTouches[0].pageY - offsety;
				} else if (e.layerX || 0 == e.layerX) {
					x = e.layerX;
					y = e.layerY;
				} else if (e.offsetX || 0 == e.offsetX) {
					x = e.offsetX;
					y = e.offsetY;
				}

				return {
					x: x,
					y: y
				};
			};
			var on_mousemove = function (e, finish) {
				e.preventDefault();
				e.stopPropagation();

				var xy = get_coords(e);
				var xyAdd = {
					x: (xyLast.x + xy.x) / 2,
					y: (xyLast.y + xy.y) / 2
				};

				if (calculate) {
					var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
					var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
					pixels.push(xLast, yLast);
				} else {
					calculate = true;
				}

				context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
				pixels.push(xyAdd.x, xyAdd.y);
				context.stroke();
				context.beginPath();
				context.moveTo(xyAdd.x, xyAdd.y);
				xyAddLast = xyAdd;
				xyLast = xy;

			};
			var calculate = false;
			canvas.addEventListener('touchstart', on_mousedown, false);
			canvas.addEventListener('mousedown', on_mousedown, false);
		},

		/***********Download the Signature Pad********************/

		saveButton: function (oEvent) {
			var canvas = document.getElementById("signature-pad");
			var link = document.createElement('a');
			link.href = canvas.toDataURL('image/jpeg');
			link.download = 'sign.jpeg';
			link.click();
			var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
				backgroundColor: '#ffffff',
				penColor: 'rgb(0, 0, 0)'
			})
		},

		/************Clear Signature Pad**************************/

		clearButton: function (oEvent) {
			var canvas = document.getElementById("signature-pad");
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);

			var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
				backgroundColor: '#ffffff',
				penColor: 'rgb(0, 0, 0)',
				penWidth: '1'
			})
		}

	});

});