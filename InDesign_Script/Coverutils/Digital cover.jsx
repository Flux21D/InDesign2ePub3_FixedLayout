﻿function PromoPDF() {
    #target 'indesign' 	
   // alert(new File(new File($.fileName).parent+"/promo-ebook pdf"));
    if(!app.pdfExportPresets.itemByName("promo-ebook pdf").isValid)
    {
      app.importFile(ExportPresetFormat.PDF_EXPORT_PRESETS_FORMAT, new File(new File($.fileName).parent+"/promo-ebook pdf.joboptions"));
    }
    else{
        app.pdfExportPresets.itemByName("promo-ebook pdf").remove();
        app.importFile(ExportPresetFormat.PDF_EXPORT_PRESETS_FORMAT, new File(new File($.fileName).parent+"/promo-ebook pdf.joboptions"));
    }
    var PDFPresetFormat=app.pdfExportPresets.itemByName("promo-ebook pdf");
    app.transformPreferences.whenScaling = WhenScalingOptions.APPLY_TO_CONTENT;
	app.transformPreferences.adjustStrokeWeightWhenScaling = true;
	app.transformPreferences.dimensionsIncludeStrokeWeight = true;
	app.transformPreferences.transformationsAreTotals = true;
	//Global
    Folder.prototype.delete  = function () {
	var files = this.getFiles();
	for (var r = 0; r < files.length; r++) {
		if (files[r]instanceof Folder) {
			files[r].delete ();
		} else {
			while (files[r].remove()) {}
		}
	}
	while (this.remove()) {}
} 
    
   /*deleting Existing*/
   
   
   var todelete=new Folder(new Folder($.fileName).parent+"/PromoPdf");
   if(todelete.exists)
   {
       todelete.delete();
   }
   var todeleteFile=new File(new Folder($.fileName).parent+"/main.pdf");
   
   if(todeleteFile.exists)
   {
       todeleteFile.remove();
   }
   /*----------------------*/
    
     //Reading Input TextFile
    var CoverDesign=null;
    var InteriorInDesign=null;
    var InputTextFile = new File(new File($.fileName).parent + "/InputTextFile.txt");
//var InputTextFile=new File("/e/AAO-Demo/testfile.txt");
if (InputTextFile.exists) {
    InputTextFile.open("r");
    var linecount = 0;
    while (!InputTextFile.eof) {
        var line = InputTextFile.readln();
        linecount++;
        if (linecount == 1) {
            CoverDesign = new File(line.split(",")[0]);
            InteriorInDesign = new File(line.split(",")[1]);
         
        } else if (linecount == 2) {}
    }
} 

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
app.open(CoverDesign);
app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;

    
	Folder.prototype.delete  = function () {
		var files = this.getFiles();
		
		for (var r = 0; r < files.length; r++) {
			if (files[r]instanceof Folder) {
				files[r].delete ();
			} else {
				while (files[r].remove()) {}
			}
		}
		while (this.remove()) {}
	}
	var fullName = app.activeDocument.fullName;

	//var tempFolder=new Folder(new Folder($.fileName).parent+"/PromoPdf");
	if (new File(app.activeDocument.filePath + "/____" + app.activeDocument.name).exists) {
	
		new File(app.activeDocument.filePath + "/____" + app.activeDocument.name).remove()
		
		
	}
	var dup = app.activeDocument.save(new File(app.activeDocument.filePath + "/____" + app.activeDocument.name));
     //new File(app.activeDocument.filePath+"/____"+app.activeDocument.name).delete();
	//new File(tempFolder+"/____"+app.activeDocument.name).hidden=true;
	var intSpineWidth = null;
	var documents = null;
	var activeDocument = null;
	var activeSpread = null;
	var appliedMaster = null;
	var spineWidth = null;
    var oldDocumentWidth = null;
	var oldDocumentHeight = null;
	var newDocumentWidth = null;
	var newDocumentHeight = null;
	var scaleDiff = null;
	var mainPdf = null;
	var flapExists = false;
	var saveTo = null;
	var isbn = "";
	var flapWidth = 0;
	var newFlapWidth = 0;
	var PDF_DETAILS = {};
    
    

    //alert(InteriorInDesign);
   // alert(CoverDesign)
   //var  InteriorInDesign=
    
	Application.prototype.SetInteractionLevel = function (userInteractionlevels) {
		app.scriptPreferences.userInteractionLevel = userInteractionlevels;
		DocumentEvent.userInteractionLevel = userInteractionlevels;
		ImportExportEvent.userInteractionLevel = userInteractionlevels;
	};
	Application.prototype.openFile = function (file) {
		try {
			app.SetInteractionLevel(UserInteractionLevels.NEVER_INTERACT);
			var opened = app.open(file);
			app.SetInteractionLevel(UserInteractionLevels.INTERACT_WITH_ALL);
			return opened;
		} catch (excep) {
			try {
				throw new Error(excep + '\nExpected: Supported docs for current version');
			} catch (e) {
				alert(e.name + ': ' + e.message + "\r\nStack: \r\n" + $.stack, "Error!", true);
				return false;
			}
		}
	}
	app.SetInteractionLevel(UserInteractionLevels.INTERACT_WITH_ALL);
	if (app.documents.length != 0) {
		if (app.activeDocument.modified) {
			var Modofied = confirm("Do you want to save the document to continue?", true);
			if (Modofied) {
				if (app.activeDocument.saved) {
					var myFileName = app.activeDocument.filePath + "/" + app.activeDocument.name;
					app.activeDocument.save(File(myFileName), true);
				} else {
					var myFileName = Folder.desktop.saveDlg("Save as", "*.indd");
					while (myFileName == null) {
						var wantexit = confirm("Are you sure you want to exit the script?");
						if (wantexit) {
							exit(0);
						} else {
							myFileName = Folder.desktop.saveDlg("Save as", "*.indd");
						}
					}
					app.activeDocument.save(File(myFileName), true);
				}
			} else {
				exit(0);
			}
		}
		app.activeDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
		app.activeDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
	}
	function myDoLockUnlock(myFunction, myScope) {
		var doLock = (myFunction == 0); //0 = lock, 1 = unlock
		var doSpreadOnly = (myScope == 1); //0 = document, 1 = spread
		var myDoc = app.activeDocument;

		if (doSpreadOnly) {
			var theSpread = myDoc.layoutWindows[0].activeSpread;
			var theItems = theSpread.pageItems;
		} else {
			var theItems = myDoc.pageItems;
		}
		var n = theItems.length;
		for (var k = 0; k < n; ++k) {
			theItem = theItems[k];
			try {
				theItem.itemLayer.locked = doLock;
				theItem.locked = doLock;
			} catch (e) {}

		}
	}
	myDoLockUnlock(1, 0);
	try {
		app.activeDocument.bookmarks.everyItem().remove();
	} catch (ert) {}

	/*
	for (var a = 0; a < app.documents.length; a++) {
	app.documents[a].viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
	app.documents[a].viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
	}
	 */
	function PromptProperties() {
		if (app.activeDocument.name.toLowerCase().match(/^.*?_j.indd$/i) != null) {
			flapExists = true;
		} else if (app.activeDocument.name.toLowerCase().match(/^.*?_c.indd$/i) != null) {
			flapExists = false;
		} else {

			var dubName = app.activeDocument.fullName;
			app.activeDocument.close(SaveOptions.NO);
			app.openFile(new File(fullName));
			new File(dubName).remove();

			//exit(0);
			try {
				throw new Error('Unable to run the script!' + '\nExpected: filename_C.indd (or) filename_J.indd');
			} catch (e) {
				alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
				, "Error!", true);
				exit(0);
			}
		}
		getSpineWitdh();
		var myDialog = app.dialogs.add({
				name : "Settings",
				canCancel : true
			});
		var s1 = null;
		var s2 = null;
		var pageWidth = null;
		var pageHeight = null;
		var imageList = null;
		var BodyPDFFS = null;
		var intrSpine = null;
		var OutputPDFFS = null;
		var flapConfirmation = null;
		var spineWidthIn = null;
		var FlapWidth = null;
		var a = app.activeDocument.links.everyItem().name
			var names = app.activeDocument.links.everyItem().name;
		var aName = null;
		var Index = 0;
		a.push("None");
		names.push("None");
		var isbnFound = false;
		while ((aName = a.pop()) != null) {
			//$.writeln(aName);
			if (isValidIsbn(aName)) {
				isbnFound = true;
				break;
			}
			Index++;
		}
		if (!isbnFound) {

			var dubName = app.activeDocument.fullName;
			app.activeDocument.close(SaveOptions.NO);
			app.openFile(new File(fullName));
			new File(dubName).remove();
			try {
				throw new Error('Barcode image which named as ISBN format not found!' + '\nExpected: isbn#.imageexe; Ex: 9784337284.ai,978-43-37-284.jpg etc...');
			} catch (e) {
				alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
				, "Error!", true);
				exit(0);
			}
		}
		isbn = aName.replace(/[^0-9]*/g, "");

		Index = (names.length - 1) - Index;
		//$.writeln(names.length-1);
		//$.writeln(Index);
		a = names;
		//a.reverse();

		with (myDialog) {
			with (dialogColumns.add()) {
				with (borderPanels.add()) {
					with (dialogRows.add()) {
						//with (borderPanels.add()) {
						with (dialogColumns.add()) {
							s1 = staticTexts.add({
									staticLabel : "Interior InDesign:                                  "
								});
						}
						with (dialogColumns.add()) {
							BodyPDFFS = staticTexts.add({
									staticLabel : "",
								});
							BodyPDFFS.staticLabel = File.decode(selectInteriorInDesign());
						}
						//}
					}
					with (dialogRows.add()) {
						//with (borderPanels.add()) {
						with (dialogColumns.add()) {
							s1 = staticTexts.add({
									staticLabel : "Output pdf:                                         "
								});
						}
						with (dialogColumns.add()) {
							OutputPDFFS = staticTexts.add({
									staticLabel : "",
								});
							//saveTo = new File(app.activeDocument.filePath + "/" + isbn + ".pdf").saveDlg("Save the output PDF", "*.pdf");
                               saveTo = new File(app.activeDocument.filePath + "/" + isbn + ".pdf");
							while (saveTo == null) {
								var wantexit = confirm("Are you sure you want to exit the script?");
								if (wantexit) {

									var dubName = app.activeDocument.fullName;
									app.activeDocument.close(SaveOptions.NO);
									app.openFile(new File(fullName));
									new File(dubName).remove();
									exit(0);
								} else {
									//saveTo = new File(app.activeDocument.filePath + "/" + isbn + ".pdf").saveDlg("Save the output PDF", "*.pdf");
                                        saveTo = new File(app.activeDocument.filePath + "/" + isbn + ".pdf");
								}
							}
							OutputPDFFS.staticLabel = File.decode(saveTo.name);
						}
						//}
					}
					with (dialogRows.add()) {
						//with (borderPanels.add()) {
						with (dialogColumns.add()) {
							s1 = staticTexts.add({
									staticLabel : "Expected page width(In inches):            "
								});
						}
						with (dialogColumns.add()) {
							pageWidth = measurementEditboxes.add({
									editValue : PDF_DETAILS.pageWidth
								});
							pageWidth.editUnits = MeasurementUnits.inches;
						}
						with (dialogColumns.add()) {
							s1 = staticTexts.add({
									staticLabel : "- "
								});
						}
						with (dialogColumns.add()) {
							intrSpine = measurementEditboxes.add({
									editValue : 18
								});
							intrSpine.editUnits = MeasurementUnits.inches;
						}
						//}
					}
					with (dialogRows.add()) {
						//with (borderPanels.add()) {
						with (dialogColumns.add()) {
							s2 = staticTexts.add({
									staticLabel : "Expected page height(In inches):           "
								});
						}
						with (dialogColumns.add()) {
							pageHeight = measurementEditboxes.add({
									editValue : PDF_DETAILS.pageHeight
								});
							pageHeight.editUnits = MeasurementUnits.inches;
						}
						//}
					}
					if (flapExists) {
						with (dialogRows.add()) {
							//with (borderPanels.add()) {
							with (dialogColumns.add()) {
								s2 = staticTexts.add({
										staticLabel : "Calculated flap width:                            "
									});
							}
							with (dialogColumns.add()) {
								FlapWidth = measurementEditboxes.add({
										editValue : activeSpread.pages[0].marginPreferences.right,
									});
								FlapWidth.editUnits = MeasurementUnits.inches;
							}
							//}
						}
					}
					/*
					with (dialogRows.add()) {
					//with (borderPanels.add()) {
					with (dialogColumns.add()) {
					s2 = staticTexts.add({
					staticLabel : "Spine width to remove(Interior Indesign):"
					});
					}
					with (dialogColumns.add()) {
					intrSpine = measurementEditboxes.add({
					editValue : 18
					});
					intrSpine.editUnits = MeasurementUnits.inches;
					}
					//}
					}
					 */
					with (dialogRows.add()) {
						//with (borderPanels.add()) {
						with (dialogColumns.add()) {
							s2 = staticTexts.add({
									staticLabel : "Barcode image:                                    "
								});
						}
						with (dialogColumns.add()) {
							imageList = dropdowns.add({
									stringList : a,
									selectedIndex : Index
								});
						}
						//}
					}
				}
			}
		}

		//if (myDialog.show()) {
        if (myDialog) {
			//flapExists=flapConfirmation.selectedButton;
			try {
				if (spineWidthIn != null) {
					spineWidth = spineWidthIn.editValue;
					activeDocument = app.activeDocument;
					activeSpread = app.activeWindow.activeSpread;
					app.activeWindow.zoom(ZoomOptions.FIT_SPREAD);
					appliedMaster = activeSpread.appliedMaster;
					if (appliedMaster.pages.length == 2) {
						pageWidth.editValue = (app.activeDocument.documentPreferences.pageWidth) - (spineWidthIn.editValue / 2);
					} else {
						pageWidth.editValue = (app.activeDocument.documentPreferences.pageWidth / 2) - (spineWidthIn.editValue / 2);
					}
				}
				newDocumentWidth = pageWidth.editValue - intrSpine.editValue;
				newDocumentHeight = pageHeight.editValue;
				if (flapExists) {
					activeSpread.pages[0].marginPreferences.right = FlapWidth.editValue
						activeSpread.pages[0].marginPreferences.left = FlapWidth.editValue
				}
				var image = app.activeDocument.links[imageList.selectedIndex];
				
				if (image.isValid) {
					image.parent.parent.remove();
				}
				intrSpine.editUnits = MeasurementUnits.points;
				intSpineWidth = intrSpine.editValue;
				
			} catch (e) {

				var dubName = app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				try {
					throw new Error('Invalid page dimensions given for this document!' + '\nExpected: Body pdf width and height.');
				} catch (e) {
					alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
					, "Error!", true);
					exit(0);
				}
			}
			main();
		} else {
			myDialog.destroy();

			var dubName = app.activeDocument.fullName;
			app.activeDocument.close(SaveOptions.NO);
			app.openFile(new File(fullName));
			new File(dubName).remove();
			exit(0);
		}
	}
	function getSpineWitdh() {
		documents = app.documents;
		if (documents.length != 0) {
			activeDocument = app.activeDocument;
			activeSpread = app.activeWindow.activeSpread;
			app.activeWindow.zoom(ZoomOptions.FIT_SPREAD);
			appliedMaster = activeSpread.appliedMaster;
			if (appliedMaster.pages.length == 2) {
				//alert("Un supported input's work flow!", "Error!", true);

				var dubName = app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				try {
					throw new Error('Un supported input structure!' + '\nExpected: Cover spread should be a single page spread.');
				} catch (e) {
					alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
					, "Error!", true);
					exit(0);
				}
			} else {
				if (activeSpread.pages[0].marginPreferences.columnCount == 2) {
					spineWidth = activeSpread.pages[0].marginPreferences.columnGutter /**scaleDiff.hFactorialScale*/
				;
					if (flapExists) {
						flapWidth = activeSpread.pages[0].marginPreferences.right;
						//$.writeln("Test1: " + flapWidth)
						scaleDiff = getDiffRatio(spineWidth, flapWidth, false);
					} else {
						scaleDiff = getDiffRatio(spineWidth, 0, false);
					}
				} else {
					//alert("Un supported input's work flow!", "Error!", true);

					var dubName = app.activeDocument.fullName;
					app.activeDocument.close(SaveOptions.NO);
					app.openFile(new File(fullName));
					new File(dubName).remove();
					try {
						throw new Error('Un supported input structure!' + '\nExpected: Cover page\'s spine should be marked as two columns in margin Preferences of the cover spread.');
					} catch (e) {
						alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
						, "Error!", true);
						exit(0);
					}
				}
			}
		} else {
			try {
				throw new Error('No documents are opened!' + '\nExpected: Open a cover .indd document.');
			} catch (e) {
				alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
				, "Error!", true);
				exit(0);
			}
		}
	}
	function main() {
		documents = app.documents;
		if (documents.length != 0) {
			activeDocument = app.activeDocument;
			activeSpread = app.activeWindow.activeSpread;
			app.activeWindow.zoom(ZoomOptions.FIT_SPREAD);
			appliedMaster = activeSpread.appliedMaster;
			if (appliedMaster.pages.length == 2) {

				var dubName = app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				try {
					throw new Error('Un supported input structure!' + '\nExpected: Cover spread should be a single page spread.');
				} catch (e) {
					alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
					, "Error!", true);
					exit(0);
				}
				doublePages();
				ignoreSpine();
			} else {
				if (activeSpread.pages[0].marginPreferences.columnCount == 2) {
					spineWidth = activeSpread.pages[0].marginPreferences.columnGutter /**scaleDiff.hFactorialScale*/
				;
					if (flapExists) {
						flapWidth = activeSpread.pages[0].marginPreferences.right;
					//	$.writeln("Test2: " + flapWidth)
						scaleDiff = getDiffRatio(spineWidth, flapWidth, false);

					} else {
						scaleDiff = getDiffRatio(spineWidth, 0, false);
					}
				} else {

					var dubName = app.activeDocument.fullName;
					app.activeDocument.close(SaveOptions.NO);
					app.openFile(new File(fullName));
					new File(dubName).remove();
					try {
						throw new Error('Un supported input structure!' + '\nExpected: Cover page\'s spine should be marked as two columns in margin Preferences of the cover spread.');
					} catch (e) {
						alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
						, "Error!", true);
						exit(0);
					}
				}
				doublePages();
				ignoreSpine();
			}
			exportPDF();
		} else {
			try {
				throw new Error('No documents are opened!' + '\nExpected: Open a cover .indd document.');
			} catch (e) {
				alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
				, "Error!", true);
				exit(0);
			}
		}
	}
	function doublePages() {
		//$.writeln(activeSpread.pageItems.everyItem());
		app.activeDocument.pasteboardPreferences.pasteboardMargins = [1000, 1000];
		app.pasteboardPreferences.pasteboardMargins = [1000, 1000];
		if (activeSpread.pageItems.length == 1 && activeDocument.groups.length == 1) {
			//$.writeln("Already grouped!");
			activeDocument.groups.everyItem().ungroup();
		}
		var group = null;
		try {
			if (activeSpread.pageItems.length > 1) {
				group = activeDocument.groups.add(activeSpread.pageItems.everyItem());
			} else if (activeSpread.pageItems.length > 0) {
				group = activeSpread.pageItems.everyItem();
			} else {
				try {
					throw new Error(ert + ": No pageItems found in cover spead!" + "\nExpected: Cover spread with one or more unlocked page items.");
				} catch (e) {
					alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
					, "Error!", true);
					exit(0);
				}
			}
		} catch (ert) {

			var dubName = app.activeDocument.fullName;
			app.activeDocument.close(SaveOptions.NO);
			app.openFile(new File(fullName));
			new File(dubName).remove();
			try {
				throw new Error(ert + " in cover INDD file." + "\nExpected: Cover spread with unlocked page items.");
			} catch (e) {
				alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
				, "Error!", true);
				exit(0);
			}
		}
		//if(!flapExists)
		if (!flapExists) {
			var GroupOldWidth = group.visibleBounds[3] - group.visibleBounds[1];
			var GroupOldHeight = group.visibleBounds[2] - group.visibleBounds[0];
			var myTransformArray = group.transformValuesOf(CoordinateSpaces.parentCoordinates);
			var myTransformationMatrix = myTransformArray[0];
			myTransformationMatrix = app.transformationMatrices.add();
			/*
			if (myTransformationMatrix instanceof Array) {
			myTransformationMatrix = myTransformationMatrix[0];
			}
			 */
			var marginWidth = app.activeDocument.documentPreferences.pageWidth - (activeSpread.pages[0].marginPreferences.left * 2);
			var marginHeight = app.activeDocument.documentPreferences.pageHeight - (activeSpread.pages[0].marginPreferences.top * 2);
			var NewWidthRatio = app.activeDocument.documentPreferences.pageWidth / marginWidth;
			var NewHeightRatio = app.activeDocument.documentPreferences.pageHeight / marginHeight;
			myTransformationMatrix = myTransformationMatrix.scaleMatrix(NewWidthRatio, NewHeightRatio);
			//$.writeln(myString);
			try {
				myTransform(group, myTransformationMatrix, [0, 0]);
				activeSpread.pages[0].marginPreferences.columnGutter = activeSpread.pages[0].marginPreferences.columnGutter * NewWidthRatio;
				spineWidth = activeSpread.pages[0].marginPreferences.columnGutter;
			} catch (err) {
				var dubName = app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				try {
					throw new Error("Unable to remove margins!\nCaused by the " + err + "\n");
				} catch (e) {
					alert(e.name + ': ' + e.message, "Error!", true);
					exit(0);
				}
			}
			//$.writeln("\n\nOn resize1: \n");
			//scaleDiff = getDiffRatio(spineWidth, 0, true);
		}
		myOldTop = app.marginPreferences.top;
		myOldLeft = app.marginPreferences.left;
		myOldRight = app.marginPreferences.right;
		myOldBottom = app.marginPreferences.bottom;

		app.marginPreferences.left = 0;
		app.marginPreferences.right = 0;
		app.marginPreferences.top = 0;
		app.marginPreferences.bottom = 0;

		app.activeDocument.marginPreferences.left = 0;
		app.activeDocument.marginPreferences.right = 0;
		app.activeDocument.marginPreferences.top = 0;
		app.activeDocument.marginPreferences.bottom = 0;

		myPage = app.activeDocument.pages[0];
		myPage.marginPreferences.left = 0;
		myPage.marginPreferences.right = 0;
		myPage.marginPreferences.top = 0;
		myPage.marginPreferences.bottom = 0;

		myMasterSpreads = app.activeDocument.masterSpreads;
		for (i = 0; i <= myMasterSpreads.length - 1; i++) {
			myMasterSpread = myMasterSpreads[i];
			for (x = 0; x <= myMasterSpread.pages.length - 1; x++) {
				myMasterSpread.pages[x].marginPreferences.right = 0;
				myMasterSpread.pages[x].marginPreferences.left = 0;
				myMasterSpread.pages[x].marginPreferences.top = 0;
				myMasterSpread.pages[x].marginPreferences.bottom = 0;
			}
		}
		try {

			activeDocument.documentPreferences.pageWidth = (newDocumentWidth != null) ? newDocumentWidth : (activeDocument.documentPreferences.pageWidth / 2) - (spineWidth / 2);
			activeDocument.documentPreferences.pageHeight = (newDocumentHeight != null) ? newDocumentHeight : activeDocument.documentPreferences.pageHeight;
		} catch (er) {
			var dubName = app.activeDocument.fullName;
			app.activeDocument.close(SaveOptions.NO);
			app.openFile(new File(fullName));
			new File(dubName).remove();
			try {
				throw new Error("Invalid page dimensions given for this document!\nCaused by the " + er + "\nExpected: Body PDF's width and height.");
			} catch (e) {
				alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
				, "Error!", true);
				exit(0);
			}
		}
		var page1 = appliedMaster.pages.add();
		activeSpread.allowPageShuffle = false;
		var page2 = activeSpread.pages.add();
		var myTransformationMatrixGroup = app.transformationMatrices.add({
				horizontalTranslation : (activeDocument.documentPreferences.pageWidth / 2)
			});
		myTransform(group, myTransformationMatrixGroup, [0, 0]);
		try {
			group.ungroup();
		} catch (er) {
			/*

			var dubName=app.activeDocument.fullName;
			app.activeDocument.close(SaveOptions.NO);
			app.openFile(new File(fullName));
			new File(dubName).remove();
			try {
			throw new Error("Invalid page dimensions given for this document!\nCaused by the "+er+ "\nExpected: Body pdf's width and height.");
			} catch (e) {
			exit(0);
			}
			 */
		}
		if (!flapExists) {
			var new_spread = activeDocument.spreads.add();
			new_spread.allowPageShuffle = false;
			new_spread.pages.add();
			var textFrame1 = new_spread.pages[0].textFrames.add();
			textFrame1.contents = "THIS PAGE \nINTENTIONALLY \nLEFT BLANK\r";
			var textFrame2 = new_spread.pages[1].textFrames.add();
			textFrame2.contents = "THIS PAGE \nINTENTIONALLY \nLEFT BLANK\r";
			textFrame1.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
			textFrame2.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;

			textFrame1.parentStory.justification = Justification.CENTER_ALIGN;
			textFrame2.parentStory.justification = Justification.CENTER_ALIGN;

			textFrame1.parentStory.appliedFont = "Minion Pro";
			textFrame2.parentStory.appliedFont = "Minion Pro";

			try {
				textFrame1.textFramePreferences.useNoLineBreaksForAutoSizing = true;
				textFrame2.textFramePreferences.useNoLineBreaksForAutoSizing = true;
				textFrame1.textFramePreferences.autoSizingReferencePoint = AutoSizingReferenceEnum.CENTER_POINT;
				textFrame1.textFramePreferences.autoSizingType = AutoSizingTypeEnum.HEIGHT_AND_WIDTH;
				textFrame2.textFramePreferences.autoSizingReferencePoint = AutoSizingReferenceEnum.CENTER_POINT;
				textFrame2.textFramePreferences.autoSizingType = AutoSizingTypeEnum.HEIGHT_AND_WIDTH;
			} catch (CampatibilityIssue) {
				textFrame1.paragraphs.everyItem().hyphenateCapitalizedWords = false;
				textFrame2.paragraphs.everyItem().hyphenateCapitalizedWords = false;
				while (textFrame1.overflows || textFrame2.overflows) {
					textFrame1.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [1, 1]);
					textFrame2.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [1, 1]);
				}
			}

			activeDocument.align(textFrame1, AlignOptions.HORIZONTAL_CENTERS, AlignDistributeBounds.PAGE_BOUNDS);
			activeDocument.align(textFrame2, AlignOptions.HORIZONTAL_CENTERS, AlignDistributeBounds.PAGE_BOUNDS);
			activeDocument.align(textFrame1, AlignOptions.VERTICAL_CENTERS, AlignDistributeBounds.PAGE_BOUNDS);
			activeDocument.align(textFrame2, AlignOptions.VERTICAL_CENTERS, AlignDistributeBounds.PAGE_BOUNDS);
		}
	}
	function ignoreSpine() {
		var pages = activeSpread.pages;
		var myPage1 = pages[0];
		var myPage2 = pages[1];
		//flapExists=false;
		if (flapExists) {
              var myTransformationMatrix1 = app.transformationMatrices.add({
				horizontalTranslation : eval("-" + ((spineWidth) / 2))
			});

		    myTransform(myPage1, myTransformationMatrix1, [0, 0]);
		     var myTransformationMatrix2 = app.transformationMatrices.add({
				horizontalTranslation : (spineWidth) / 2
			});
		    myTransform(myPage2, myTransformationMatrix2, [0, 0]);
			var flapSpread = activeSpread.duplicate(LocationOptions.AFTER);
			var flapPages = flapSpread.pages;
			var flapPage1 = flapPages[0];
			var flapPage2 = flapPages[1];

			//myPage1.resize(CoordinateSpaces.PASTEBOARD_COORDINATES,AnchorPoint.RIGHT_CENTER_ANCHOR,ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,[(newFlapWidth),(myPage1.bounds[2]-myPage1.bounds[0])]);
			//myPage2.resize(CoordinateSpaces.PASTEBOARD_COORDINATES,AnchorPoint.LEFT_CENTER_ANCHOR,ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,[(newFlapWidth),(myPage2.bounds[2]-myPage2.bounds[0])]);
		//	$.writeln(newFlapWidth);
             
             flapPage1.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.RIGHT_CENTER_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [(oldDocumentWidth), (newDocumentHeight)]);
		    flapPage2.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.LEFT_CENTER_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [(oldDocumentWidth), (newDocumentHeight)]);
             flapPage1.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.LEFT_CENTER_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [(newFlapWidth), (newDocumentHeight)]);
		    flapPage2.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.RIGHT_CENTER_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [(newFlapWidth), (newDocumentHeight)]);
             		
          var myTransformationMatrix1 = app.transformationMatrices.add({
					horizontalTranslation : eval("-" + newFlapWidth)
				});

			myTransform(flapPage1, myTransformationMatrix1, [0, 0]);
			var myTransformationMatrix2 = app.transformationMatrices.add({
					horizontalTranslation : newFlapWidth
				});
			myTransform(flapPage2, myTransformationMatrix2, [0, 0]);
			//flapPage1.resize(CoordinateSpaces.PASTEBOARD_COORDINATES,AnchorPoint.LEFT_CENTER_ANCHOR,ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,[((myPage1.bounds[3]-myPage1.bounds[1])-newFlapWidth),(myPage1.bounds[2]-myPage1.bounds[0])]);
			//flapPage2.resize(CoordinateSpaces.PASTEBOARD_COORDINATES,AnchorPoint.RIGHT_CENTER_ANCHOR,ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH,[((myPage2.bounds[3]-myPage2.bounds[1])-newFlapWidth),(myPage2.bounds[2]-myPage2.bounds[0])]);
		} else {
            var myTransformationMatrix1 = app.transformationMatrices.add({
				horizontalTranslation : eval("-" + ((spineWidth * scaleDiff.hFactorialScale) / 2))
			});

		myTransform(myPage1, myTransformationMatrix1, [0, 0]);
		var myTransformationMatrix2 = app.transformationMatrices.add({
				horizontalTranslation : (spineWidth * scaleDiff.hFactorialScale) / 2
			});
		myTransform(myPage2, myTransformationMatrix2, [0, 0]);
         }
         resizeSpreadWithItems(activeSpread);
     }
	function exportPDF() {
		try {
			// app.pdfExportPreferences.acrobatCompatibility=AcrobatCompatibility.reflect.properties[AcrobatCompatibility.reflect.properties.length-2];
			//app.pdfExportPreferences.acrobatCompatibility=eval("AcrobatCompatibility."+AcrobatCompatibility.reflect.properties[AcrobatCompatibility.reflect.properties.length-2]);
		} catch (wer) {}

//~ 		app.interactivePDFExportPreferences.exportLayers = true;
//~ 		app.interactivePDFExportPreferences.rasterResolution=150;
//~ 		app.interactivePDFExportPreferences.pdfJPEGQuality=PDFJPEGQualityOptions.MAXIMUM;
//~ 		app.interactivePDFExportPreferences.pdfRasterCompression=PDFRasterCompressionOptions.LOSSLESS_COMPRESSION;
//~ 		app.interactivePDFExportPreferences.generateThumbnails = true;
//~ 		app.interactivePDFExportPreferences.includeStructure = true;
//~ 		app.interactivePDFExportPreferences.viewPDF = false;
//~ 		app.interactivePDFExportPreferences.exportReaderSpreads = false;
//~ 		app.interactivePDFExportPreferences.interactivePDFInteractiveElementsOption = InteractivePDFInteractiveElementsOptions.INCLUDE_ALL_MEDIA;
		var pages = activeDocument.pages;
		var pdfs = new Folder(new Folder($.fileName).parent + "/PromoPdf/pdfs");
		if (!pdfs.exists) {
			pdfs.create();
		}
		for (var a = 0; a < pages.length; a++) {
			var bookMark = null;
			if (a == 0) {
				bookMark = activeSpread.parent.bookmarks.add(pages[a]);
				bookMark.name = "Back Cover";
                
                     var  ExportFile=new File(pdfs + "/Backcover.jpg");
                     app.jpegExportPreferences.jpegExportRange = ExportRangeOrAllPages.EXPORT_RANGE;
					app.jpegExportPreferences.exportingSpread = false;
					app.jpegExportPreferences.pageString = pages[a].name;
                      app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.MAXIMUM;
					app.jpegExportPreferences.exportResolution =300;
                     app.activeDocument.exportFile(ExportFormat.JPG,ExportFile,undefined);
                 
			}
			if (a == 1) {
				bookMark = activeSpread.parent.bookmarks.add(pages[a]);
				bookMark.name = "Cover";
                
                   var  ExportFile=new File(pdfs + "/Cover.jpg");
                     app.jpegExportPreferences.jpegExportRange = ExportRangeOrAllPages.EXPORT_RANGE;
					app.jpegExportPreferences.exportingSpread = false;
					app.jpegExportPreferences.pageString = pages[a].name;
                      app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.MAXIMUM;
					app.jpegExportPreferences.exportResolution =300;
                     app.activeDocument.exportFile(ExportFormat.JPG,ExportFile,undefined);
			}
			var pdfName = new File(pdfs + "/page_" + pages[a].name + ".pdf");
			if (flapExists) {
				if (a == 2) {
					bookMark = activeSpread.parent.bookmarks.add(pages[a]);
					bookMark.name = "Back Flap";
					//pdfName=new File(pdfs + "/page_4.pdf");
				}
				if (a == 3) {
					bookMark = activeSpread.parent.bookmarks.add(pages[a]);
					bookMark.name = "Front Flap";
					//pdfName=new File(pdfs + "/page_3.pdf");
				}
			}
                 app.pdfExportPreferences.pageRange = pages[a].name;

                  
//~ 			app.interactivePDFExportPreferences.pageRange = pages[a].name;

			pdfName = (a == 0) ? new File(pdfs + "/Back Cover.pdf") : new File(pdfs + "/Front Cover.pdf");
			pdfName = (a > 1) ? new File(pdfs + "/Page " + pages[a].name + ".pdf") : pdfName;
//~ 			app.interactivePDFExportPreferences.exportLayers = true;
//~ 			app.interactivePDFExportPreferences.rasterResolution=150;
//~ 		    app.interactivePDFExportPreferences.pdfJPEGQuality=PDFJPEGQualityOptions.MAXIMUM;
//~ 			app.interactivePDFExportPreferences.pdfRasterCompression=PDFRasterCompressionOptions.LOSSLESS_COMPRESSION;
//~ 			app.interactivePDFExportPreferences.generateThumbnails = true;
//~ 			app.interactivePDFExportPreferences.includeStructure = true;
//~ 			app.interactivePDFExportPreferences.viewPDF = false;
//~ 			app.interactivePDFExportPreferences.exportReaderSpreads = false;
//~ 			app.interactivePDFExportPreferences.interactivePDFInteractiveElementsOption = InteractivePDFInteractiveElementsOptions.INCLUDE_ALL_MEDIA;
//~ 			activeDocument.exportFile(ExportFormat.INTERACTIVE_PDF, pdfName);
                    //  $.writeln(pdfName +" "+activeDocument);
//~                   app.jpegExportPreferences.exportResolution = 300;
//~                  app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.MAXIMUM;
//~                  var  ExportFile=new File(pdfName.fsName.toString().replace(".pdf",".jpg"))
//~                  
//~                  if(ExportFile.fsName.toString().match("Back Cover")!=null||ExportFile.fsName.toString().match("Front Cover")!=null)
//~                  {
//~                       app.jpegExportPreferences.jpegExportRange = ExportRangeOrAllPages.EXPORT_RANGE;
//~ 					app.jpegExportPreferences.exportingSpread = false;
//~ 					app.jpegExportPreferences.pageString = pageName;
//~                       app.jpegExportPreferences.jpegQuality = JPEGOptionsQuality.MAXIMUM;
//~ 					app.jpegExportPreferences.exportResolution =300;
//~                  activeDocument.exportFile(ExportFormat.JPG,ExportFile,undefined);
//~                  $.writeln(ExportFile.fsName)
//~                  
//~                   }
                 
                 
                // 
                 
                 activeDocument.exportFile(ExportFormat.PDF_TYPE, pdfName, undefined, PDFPresetFormat);
			if (bookMark != null) {
				bookMark.remove();
			}
		}
        
		mainPdf.copy(new File(pdfs + "/Main.pdf"));
		runCmd(pdfs);
		//pdfs.execute();
	}
	function resizeSpreadWithItems(spread) {
		var group = null;
		try {
			if (activeSpread.pageItems.length > 1) {
				group = activeDocument.groups.add(activeSpread.pageItems.everyItem());
			} else if (activeSpread.pageItems.length > 0) {
				group = activeSpread.pageItems.everyItem();
			} else {
				try {
					throw new Error(ert + ": No pageItems found in cover spead!" + "\nExpected: Cover spread with one or more unlocked page items.");
				} catch (e) {
					alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
					, "Error!", true);
					exit(0);
				}
			}
		} catch (ert) {

			var dubName = app.activeDocument.fullName;
			app.activeDocument.close(SaveOptions.NO);
			app.openFile(new File(fullName));
			new File(dubName).remove();
			try {
				throw new Error(ert + " in cover INDD file." + "\nExpected: Cover spread with unlocked page items.");
			} catch (e) {
				alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
				, "Error!", true);
				exit(0);
			}
		}

		var myTransformArray = group.transformValuesOf(CoordinateSpaces.parentCoordinates);
		var myTransformationMatrix = myTransformArray[0];
		myTransformationMatrix = app.transformationMatrices.add();
		/*
		if (myTransformationMatrix instanceof Array) {
		myTransformationMatrix = myTransformationMatrix[0];
		}
		 */

		//$.writeln("Hi :::" + scaleDiff.hFactorialScale);
		//$.writeln("Hi :::" + scaleDiff.vFactorialScale);
		//$.writeln("Hi2 :::" + myTransformationMatrix.horizontalScaleFactor);
		//$.writeln("Hi2 :::" + myTransformationMatrix.verticalScaleFactor);
		myTransformationMatrix = myTransformationMatrix.scaleMatrix(scaleDiff.hFactorialScale, scaleDiff.vFactorialScale);
		var myRotationAngle = myTransformationMatrix.counterclockwiseRotationAngle;
		var myShearAngle = myTransformationMatrix.clockwiseShearAngle;
		var myXScale = myTransformationMatrix.horizontalScaleFactor;
		var myYScale = myTransformationMatrix.verticalScaleFactor;
		var myXTranslate = myTransformationMatrix.horizontalTranslation;
		var myYTranslate = myTransformationMatrix.verticalTranslation;
		var myString = "Rotation Angle: " + myRotationAngle + "\r";
		myString += "Shear Angle: " + myShearAngle + "\r";
		myString += "Horizontal Scale Factor: " + myXScale + "\r";
		myString += "Vertical Scale Factor: " + myYScale + "\r";
		myString += "Horizontal Translation: " + myXTranslate + "\r";
		myString += "Vertical Translation: " + myYTranslate + "\r";
		//$.writeln("\n\nOn resize2: \n" + myString);
		myTransform(group, myTransformationMatrix, [0, 0]);
	}
	function myTransform(myitem, myTransformationMatrix, anchorpoint) {
		myitem.transform(CoordinateSpaces.PASTEBOARD_COORDINATES,
			anchorpoint,
			myTransformationMatrix);
	}
	function getDiffRatio(sw, fw, printMesur) {
		var Fw = 0;
		var Fh = 0;
		var pw1 = ((app.activeDocument.documentPreferences.pageWidth / 2) - sw / 2) - fw;
		var ph1 = app.activeDocument.documentPreferences.pageHeight;
         oldDocumentWidth=pw1;
         oldDocumentHeight=ph1;
		var pw2 = newDocumentWidth;
		var ph2 = newDocumentHeight;
		var bigW = (pw1 > pw2) ? pw1 : pw2;
		var bigH = (ph1 > ph2) ? ph1 : ph2;
		var SmallW = (pw1 < pw2) ? pw1 : pw2;
		var SmallH = (ph1 < ph2) ? ph1 : ph2;
		var oldFlapRatio = fw / pw1;
		newFlapWidth = fw;
		Fw = (pw2 / pw1);
		Fh = (ph2 / ph1);
		if (printMesur) {

			/*
			$.writeln("Original Page Width: " + pw1);
			$.writeln("Original Page Height: " + ph1);
			$.writeln("Optimized Page width: " + pw2);
			$.writeln("Original Page Height: " + ph2);
			//$.writeln("Bigger Width: " + bigW);
			//$.writeln("Bigger Height: " + bigH);
			//$.writeln("Small Width: " + SmallW);
			//$.writeln("Small Width: " + SmallH);
			$.writeln("Spine Width: " + sw);
			$.writeln("Old Flap Width: " + fw);
			$.writeln("New Flap Width: " + newFlapWidth);
			$.writeln("h_FactorialScale: " + Fw);
			$.writeln("v_FactorialScale: " + Fh);
			 */

		}
		return {
			hFactorialScale : Fw,
			vFactorialScale : Fh
		};
	}
	function setWidthHeight(/*PageItem*/
		o, /*str*/
		w, /*str*/
		h, anchorPoint, resizeMethods, coordinateSpaces, /*bool=false*/
		useVisibleBounds) {
		if (!(o && 'resize' in o))
			return;
		var CS_INNER = coordinateSpaces,
		BB = BoundingBoxLimits[
				(useVisibleBounds ? 'OUTER_STROKE' : 'GEOMETRIC_PATH')
				 + '_BOUNDS'];
		var wPt = UnitValue(w).as('pt'),
		hPt = UnitValue(h).as('pt');
		if (0 >= wPt || 0 >= hPt)
			return;
		o.resize(
			[CS_INNER, BB],
			anchorPoint,
			resizeMethods,
			[wPt, hPt, CS_INNER]);
	}

	function runCmd(input1) {
		if (input1 == null) {
			exit(0);
		}
		var jar = new File(new Folder($.fileName).parent + "/Crop_and_Merge.jar");
		if ($.os.toLowerCase().indexOf("windows") != -1) {
        
             
                //var runBat=new File();
			//var runBat = new File(new Folder($.fileName).parent + "/runCmd.bat");
            
             var testbat=new File(new Folder($.fileName).parent+ "/runCmd2.bat");
            
			testbat.open("w");
			testbat.writeln("java -jar \"" + Folder.decode(jar.fsName) + "\" \"" + File.decode(input1.fsName) + "\" \"" + saveTo.fsName + "\" \"" + flapExists + "\" \"" + intSpineWidth + "\"");
			testbat.close();
			//runBat.execute();
            
            var scpt= 'Dim oShell\n'
				 + 'Set oShell = CreateObject ("WScript.Shell")\n'
				 + 'oShell.run """' + testbat.fsName + '""",0,1\n'
				 + 'Set oShell = Nothing';
			try {
				app.doScript(scpt, ScriptLanguage.visualBasic);
			} catch (ert) {
				alert("An unexpected error from external tool!\nDetails:" + ert)
			}
		} else {
			var applescript = "set runCmd to \"java -jar  \\\"" + jar.fsName + "\\\" \\\"" + File.decode(input1.fsName) + "\\\" \\\"" + saveTo.fsName + "\\\" \\\"" + flapExists + "\\\" \\\"" + intSpineWidth + "\\\"\"\n"
				 + "do shell script runCmd\n";
			try {
				app.doScript(applescript, ScriptLanguage.APPLESCRIPT_LANGUAGE);
			} catch (ert) {
				alert("An unexpected error from external tool!\nDetails:" + ert);
			}
		}
	}

	function getPdfDetails(input1) {
		if (input1 == null) {
			exit(0);
		}
		var jar = new File(new Folder($.fileName).parent + "/PdfDetails.jar");
		if ($.os.toLowerCase().indexOf("windows") != -1) {

			new File(input1.parent + "/pdfInfo.txt").remove();
			//var runBat = new File(new Folder($.fileName).parent + "/runCmd.bat");
            var testbat=new File(new Folder($.fileName).parent+ "/runCmd1.bat");
            
            testbat.open("w");
            testbat.writeln("java -jar \"" + Folder.decode(jar.fsName) + "\" \"" + File.decode(input1.fsName) + "\"");
            testbat.close();
            
			//runBat.open("w");
			//runBat.writeln("java -jar \"" + Folder.decode(jar.fsName) + "\" \"" + File.decode(input1.fsName) + "\"");
			//runBat.close();
			/*
			runBat.execute();
			while(!new File(input1.parent+"/pdfInfo.txt").exists){
			}
			 */
             //alert(testbat.exists)
             //alert(runBat.fsName +" "+testbat.fsName );
             
             var scpt1= 'Dim oShell\n'
				 + 'Set oShell = CreateObject ("WScript.Shell")\n'
				 + 'oShell.run """' + testbat.fsName + '""",0,1\n'
				 + 'Set oShell = Nothing';
			try {

				app.doScript(scpt1, ScriptLanguage.visualBasic);

			} catch (ert) {
				alert("An unexpected error from external tool!\nDetails:" + ert)
			}
//~ 			var scpt = 'Dim oShell\n'
//~ 				 + 'Set oShell = CreateObject ("WScript.Shell")\n'
//~ 				 + 'oShell.run "' + runBat.fsName + '",0,1\n'
//~ 				 + 'Set oShell = Nothing';
//~ 			try {
//~ 				app.doScript(scpt, ScriptLanguage.visualBasic);
//~ 			} catch (ert) {
//~ 				alert("An unexpected error from external tool!\nDetails:" + ert)
//~ 			}
		} else {
			var applescript = "set runCmd to \"java -jar  \\\"" + jar.fsName + "\\\" \\\"" + File.decode(input1.fsName) + "\\\"\"\n"
				 + "do shell script runCmd\n";
			try {
				app.doScript(applescript, ScriptLanguage.APPLESCRIPT_LANGUAGE);
			} catch (ert) {
				alert("An unexpected error from external tool!\nDetails:" + ert)
			}
		}
		return new File(input1.parent + "/pdfInfo.txt");
	}
	Application.prototype.selectFolder = function (prompt) {
		if (prompt == $.global.undefined) {
			prompt = "Select Folder"
		}
		var History_inputFolder = $.getenv("INDD_Script_LastRunFolder");
		var inputFolder = null;
		if (History_inputFolder == null) {
			inputFolder = Folder.selectDialog(prompt);
			if (inputFolder == null) {
				exit(0);
			}
			$.setenv("INDD_Script_LastRunFolder", inputFolder.fsName);
		} else {
			inputFolder = new Folder(History_inputFolder).selectDlg(prompt);
			if (inputFolder == null) {
				exit(0);
			}
			$.setenv("INDD_Script_LastRunFolder", inputFolder.fsName);
		}
		return inputFolder;
	}
	Application.prototype.selectFile = function (prompt, filter) {
		if (prompt == $.global.undefined) {
			prompt = "Open an Indesign File"
		}
		var History_inputFile = $.getenv("INDD_Script_LastRunFile");
		var inputFile = null;
		if (History_inputFile == null) {
			inputFile = File.openDialog(prompt, filter);
			if (inputFile == null) {
				//exit(0);
			} else {
				$.setenv("INDD_Script_LastRunFile", inputFile.fsName);
			}
		} else {
			inputFile = new Folder(History_inputFile).openDlg(prompt, filter);
			if (inputFile == null) {
				//exit(0);
			} else {
				$.setenv("INDD_Script_LastRunFile", inputFile.fsName);
			}
		}
		return inputFile;
	}
	var isValidIsbn = function (str) {

		var sum,
		weight,
		digit,
		check,
		i;

		str = str.replace(/[^0-9X]/gi, '');

		if (str.length != 10 && str.length != 13) {
			return false;
		}

		if (str.length == 13) {
			sum = 0;
			for (i = 0; i < 12; i++) {
				digit = parseInt(str[i]);
				if (i % 2 == 1) {
					sum += 3 * digit;
				} else {
					sum += digit;
				}
			}
			check = (10 - (sum % 10)) % 10;
			return (check == str[str.length - 1]);
		}

		if (str.length == 10) {
			weight = 10;
			sum = 0;
			for (i = 0; i < 9; i++) {
				digit = parseInt(str[i]);
				sum += weight * digit;
				weight--;
			}
			check = 11 - (sum % 11);
			if (check == 10) {
				check = 'X';
			}
			return (check == str[str.length - 1].toUpperCase());
		}
	}
	function selectInteriorInDesign() {
		//InteriorInDesign = app.selectFile("Select interior InDesign file", "*.indd");
        InteriorInDesign=new File(InteriorInDesign);   
        
		mainPdf = new File(new Folder($.fileName).parent + "/main.pdf");
        
		while (InteriorInDesign == null) {
			var wantexit = confirm("Are you sure you want to exit the script?");
			if (wantexit) {

				var dubName = app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				exit(0);
			} else {
				InteriorInDesign = app.selectFile("Select interior InDesign file", "*.indd");
			}
		}
		if (InteriorInDesign != null) {
			var InteriorInDesignDoc = app.openFile(InteriorInDesign);
			app.updateFonts();
			/*
			//Resize content;
			myDoLockUnlock(1, 0);
			app.activeDocument.spreads.everyItem().allowPageShuffle=false;
			app.activeDocument.documentPreferences.facingPages=false;
			app.activeDocument.pages.everyItem().layoutRule=LayoutRuleOptions.OFF;
			//app.activeDocument.pages.everyItem().layoutRule=LayoutRuleOptions.OFF;
			var spreads = InteriorInDesignDoc.spreads.everyItem().getElements();
			spreads=spreads.concat (InteriorInDesignDoc.masterSpreads.everyItem().getElements());

			while ((spread = spreads.pop()) != null) {
			var pages = spread.pages;
			if(pages.length==2){
			var myPage1 = pages[0];
			var myPage2 = pages[1];
			myPage1.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.LEFT_CENTER_ANCHOR, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [-18,0],undefined,true);
			myPage2.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.RIGHT_CENTER_ANCHOR, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [-18,0],undefined,true);
			}
			else{
			var myPage = pages[0];
			if(myPage.side==PageSideOptions.RIGHT_HAND){
			myPage.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.RIGHT_CENTER_ANCHOR, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [-18,0],undefined,true);
			}
			else if(myPage.side==PageSideOptions.LEFT_HAND){
			myPage.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.LEFT_CENTER_ANCHOR, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [-18,0],undefined,true);
			}
			else{
			myPage.resize(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.ADDING_CURRENT_DIMENSIONS_TO, [-18,0],undefined,true);
			}
			}

			}
			 */
			if (mainPdf.exists) {
				if (mainPdf.remove()) {}
			}
//~ 			app.interactivePDFExportPreferences.exportLayers = false;
//~ 			app.interactivePDFExportPreferences.rasterResolution=150;
//~ 			app.interactivePDFExportPreferences.pdfRasterCompression=PDFRasterCompressionOptions.LOSSLESS_COMPRESSION;
//~              app.interactivePDFExportPreferences.pdfJPEGQuality=PDFJPEGQualityOptions.MAXIMUM;
//~ 			app.interactivePDFExportPreferences.generateThumbnails = true;
//~ 			app.interactivePDFExportPreferences.includeStructure = true;
//~ 			app.interactivePDFExportPreferences.viewPDF = false;
//~ 			app.interactivePDFExportPreferences.exportReaderSpreads = false;
//~ 			app.interactivePDFExportPreferences.interactivePDFInteractiveElementsOption = InteractivePDFInteractiveElementsOptions.INCLUDE_ALL_MEDIA;
//~ 			app.interactivePDFExportPreferences.pageRange = PageRange.ALL_PAGES;
            
              app.pdfExportPreferences.pageRange=PageRange.ALL_PAGES;
			InteriorInDesignDoc.exportFile(ExportFormat.PDF_TYPE, mainPdf, undefined, PDFPresetFormat);
			Inddname = InteriorInDesignDoc.name;
			InteriorInDesignDoc.close(SaveOptions.NO);
			if (mainPdf != null) {
				var reportFile = getPdfDetails(mainPdf);
				if (reportFile.exists) {
					reportFile.open("r");
					var script = reportFile.read();
					try {
						app.doScript(script, ScriptLanguage.JAVASCRIPT)
					} catch (ert) {
						try {
							throw new Error('Invalid body text PDF for this script version!\n\nTechnical details: ' + script + '\n\nExpected: A valid body text PDF to merge.');
						} catch (e) {
							alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
							, "Error!", true);
							exit(0);
						}
					}
					reportFile.close();
				}
				try {
					PDF_DETAILS = PDFDetails;
				} catch (errt) {

					var dubName = app.activeDocument.fullName;
					app.activeDocument.close(SaveOptions.NO);
					app.openFile(new File(fullName));
					new File(dubName).remove();
					try {
						throw new Error('The selected body PDF throws following unexpected error!\n\n' + errt + '\nExpected: A body text PDF to merge.');
					} catch (e) {
						alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
						, "Error!", true);
						exit(0);
					}
				}
				var Warnings = "";
				var sno = 0;
				if (PDF_DETAILS.title == "" || PDF_DETAILS.title == "null") {
					sno++;
					Warnings = Warnings + sno + ". Title missing in PDF's meta data.\n"
				} else {
					app.findTextPreferences = NothingEnum.nothing;
					app.changeTextPreferences = NothingEnum.nothing;
					app.findTextPreferences.findWhat = PDF_DETAILS.title;
					var founds = app.activeDocument.findText();
					if (founds.length == 0) {
						sno++;
						Warnings = Warnings + sno + ". Title mismatch between indesign and PDF.\n"
					}
				}

				if (PDF_DETAILS.author == "" || PDF_DETAILS.author == "null") {
					sno++;
					Warnings = Warnings + sno + ". Author name missing in PDF's meta data.\n";
				} else {
					app.findTextPreferences = NothingEnum.nothing;
					app.changeTextPreferences = NothingEnum.nothing;
					app.findTextPreferences.findWhat = PDF_DETAILS.author;
					var founds = app.activeDocument.findText();
					if (founds.length == 0) {
						sno++;
						Warnings = Warnings + sno + ". Author name mismatch between indesign and PDF.\n";
					}
				}
				if (!PDF_DETAILS.bookmarksFound) {
					sno++;
					Warnings = Warnings + sno + ". Bookmarks missing in PDF.\n";
				}
				if (PDF_DETAILS.isbn == "" || PDF_DETAILS.isbn == "null") {
					sno++;
					Warnings = Warnings + sno + ". ISBN number missing in PDF's meta data.\n";
				} else if (PDF_DETAILS.isbn.replace(/[^0-9]/g, "") != isbn) {
					sno++;
					Warnings = Warnings + sno + ". ISBN number mismatch between indesign and PDF.(" + PDF_DETAILS.isbn.replace(/[^0-9]/g, "") + " vs " + isbn + ")\n";
				}
				if (sno != 0) {
					/*
					var confirmTheDoubt=confirm("Bookmarks or Metadata missing/mismatch. You still want to continue?\n\n"+Warnings,true,"Alert!");
					if(!confirmTheDoubt){

					var dubName=app.activeDocument.fullName;
					app.activeDocument.close(SaveOptions.NO);
					app.openFile(new File(fullName));
					new File(dubName).remove();
					exit(0);
					//selectBodyPdf();
					}
					 */

				}
			}
		}
		return Inddname;
	}

	function selectBodyPdf() {
		mainPdf = app.selectFile("Select body PDF", "*.pdf");
		while (mainPdf == null) {
			var wantexit = confirm("Are you sure you want to exit the script?");
			if (wantexit) {

				var dubName = app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				exit(0);
			} else {
				mainPdf = app.selectFile("Select body PDF", "*.pdf");
			}
		}
		if (mainPdf != null) {
			var reportFile = getPdfDetails(mainPdf);
			if (reportFile.exists) {
				reportFile.open("r");
				var script = reportFile.read();
				try {
					app.doScript(script, ScriptLanguage.JAVASCRIPT)
				} catch (ert) {
					try {
						throw new Error('Invalid body text PDF for this script version!\n\nTechnical details: ' + script + '\n\nExpected: A valid body text PDF to merge.');
					} catch (e) {
						alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
						, "Error!", true);
						exit(0);
					}
				}
				reportFile.close();
			}
			try {
				PDF_DETAILS = PDFDetails;
			} catch (errt) {

				var dubName = app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				try {
					throw new Error('The selected body PDF throws following unexpected error!\n\n' + errt + '\nExpected: A body text PDF to merge.');
				} catch (e) {
					alert(e.name + ': ' + e.message /*+ "\r\nStack: \r\n" + $.stack*/
					, "Error!", true);
					exit(0);
				}
			}
			var Warnings = "";
			var sno = 0;
			if (PDF_DETAILS.title == "" || PDF_DETAILS.title == "null") {
				sno++;
				Warnings = Warnings + sno + ". Title missing in PDF's meta data.\n"
			} else {
				app.findTextPreferences = NothingEnum.nothing;
				app.changeTextPreferences = NothingEnum.nothing;
				app.findTextPreferences.findWhat = PDF_DETAILS.title;
				var founds = app.activeDocument.findText();
				if (founds.length == 0) {
					sno++;
					Warnings = Warnings + sno + ". Title mismatch between indesign and PDF.\n"
				}
			}

			if (PDF_DETAILS.author == "" || PDF_DETAILS.author == "null") {
				sno++;
				Warnings = Warnings + sno + ". Author name missing in PDF's meta data.\n";
			} else {
				app.findTextPreferences = NothingEnum.nothing;
				app.changeTextPreferences = NothingEnum.nothing;
				app.findTextPreferences.findWhat = PDF_DETAILS.author;
				var founds = app.activeDocument.findText();
				if (founds.length == 0) {
					sno++;
					Warnings = Warnings + sno + ". Author name mismatch between indesign and PDF.\n";
				}
			}
			if (!PDF_DETAILS.bookmarksFound) {
				sno++;
				Warnings = Warnings + sno + ". Bookmarks missing in PDF.\n";
			}
			if (PDF_DETAILS.isbn == "" || PDF_DETAILS.isbn == "null") {
				sno++;
				Warnings = Warnings + sno + ". ISBN number missing in PDF's meta data.\n";
			} else if (PDF_DETAILS.isbn.replace(/[^0-9]/g, "") != isbn) {
				sno++;
				Warnings = Warnings + sno + ". ISBN number mismatch between indesign and PDF.(" + PDF_DETAILS.isbn.replace(/[^0-9]/g, "") + " vs " + isbn + ")\n";
			}
			if (sno != 0) {
				/*
				var confirmTheDoubt=confirm("Bookmarks or Metadata missing/mismatch. You still want to continue?\n\n"+Warnings,true,"Alert!");
				if(!confirmTheDoubt){

				var dubName=app.activeDocument.fullName;
				app.activeDocument.close(SaveOptions.NO);
				app.openFile(new File(fullName));
				new File(dubName).remove();
				exit(0);
				//selectBodyPdf();
				}
				 */

			}
		}
		return mainPdf.name
	}

	PromptProperties();

	var dubName = app.activeDocument.fullName;
	app.activeDocument.close(SaveOptions.NO);
	app.openFile(new File(fullName));
	new File(dubName).remove();

	app.activeDocument.close(SaveOptions.NO);
    app.documents.everyItem().close(SaveOptions.NO);
}
PromoPDF();