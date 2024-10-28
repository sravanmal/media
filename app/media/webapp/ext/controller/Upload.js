sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (MessageBox, MessageToast) {
    'use strict';

    function _createUploadController(oExtensionAPI) {
        var oUploadDialog;

        function setOkButtonEnabled(bOk) {
            oUploadDialog && oUploadDialog.getBeginButton().setEnabled(bOk);
        }

        function setDialogBusy(bBusy) {
            oUploadDialog.setBusy(bBusy)
        }

        function closeDialog() {
            oUploadDialog && oUploadDialog.close()
        }

        function showError(sMessage) {
            MessageBox.error(sMessage || "Upload failed")
        }

        // TODO: Better option for this?
        function byId(sId) {
            return sap.ui.core.Fragment.byId("uploadDialog", sId);
        }

        return {
            onBeforeOpen: function (oEvent) {
                oUploadDialog = oEvent.getSource();
                oExtensionAPI.addDependent(oUploadDialog);
            },

            onAfterClose: function (oEvent) {
                oExtensionAPI.removeDependent(oUploadDialog);
                oUploadDialog.destroy();
                oUploadDialog = undefined;
            },

            onOk: function (oEvent) {

                setDialogBusy(true)

                var oFileUploader = byId("uploader")
                // oFileUploader.oFileUpload.files[0] // reading the file content

                var file = oFileUploader.oFileUpload.files[0];

                if (file) {
                    // Create a FileReader instance
                    var reader = new FileReader();

                    console.log(file);
                    
                    // Define the onload event handler
                    reader.onload = function(event) {
                        // Get the binary data as an ArrayBuffer
                        var binaryData = event.target.result;
                        
                        // You can also convert it to a Uint8Array if needed
                        var byteArray = new Uint8Array(binaryData);
                
                        console.log(byteArray); // This is your file data in binary format
                        // Now you can use byteArray for further processing


                        oFileUploader.checkFileReadable()
                    .then(function () {
                        return oFileUploader.upload(); // Starts the file upload
                    })
                    .then(function () {
                        // First, make a POST request
                        return fetch('https://port4004-workspaces-ws-5nbsb.us10.trial.applicationstudio.cloud.sap/odata/v4/MediaService/media', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "fileName": file.name,
                                "MediaType": file.type,
                                "size"  : file.size
                            })
                        });
                    })
                    .then(function (postResponse) {
                        if (!postResponse.ok) {
                            throw new Error("POST request failed.");
                        }
                        return postResponse.json(); // Process POST response to get ID
                    })
                    .then(function (postData) {
                        var recordId = postData.ID; // Assuming the ID is returned in the response body

                        // After POST completes, make the PUT request using the recordId
                        return fetch(`https://port4004-workspaces-ws-5nbsb.us10.trial.applicationstudio.cloud.sap/odata/v4/MediaService/media/${recordId}/content`, {
                            method: 'PUT',
                            body: byteArray
                        });
                    })
                    .then(function (putResponse) {
                        if (!putResponse.ok) {
                            throw new Error("PUT request failed.");
                        }
                        return putResponse.json(); // Process PUT response if needed
                    })
                    .then(function () {
                        // Both requests were successful
                        MessageToast.show("File uploaded and data updated successfully.");

                    })
                    .catch(function (error) {
                        showError(error.message);
                        setDialogBusy(false);
                    });


                    };
                    
                    // Read the file as an ArrayBuffer
                    reader.readAsArrayBuffer(file);
                } else {
                    console.log("No file selected.");
                }


                
                

            },

            onCancel: function (oEvent) {
                closeDialog();
            },

            onTypeMismatch: function (oEvent) {
                var sSupportedFileTypes = oEvent
                    .getSource()
                    .getFileType()
                    .map(function (sFileType) {
                        return "*." + sFileType;
                    })
                    .join(", ");

                showError(
                    "The file type *." +
                    oEvent.getParameter("fileType") +
                    " is not supported. Choose one of the following types: " +
                    sSupportedFileTypes
                );
            },

            onFileAllowed: function (oEvent) {
                setOkButtonEnabled(true)
            },

            onFileEmpty: function (oEvent) {
                setOkButtonEnabled(false)
            },

            onUploadComplete: function (oEvent) {
                var iStatus = oEvent.getParameter("status");
                var oFileUploader = oEvent.getSource()

                oFileUploader.clear();
                setOkButtonEnabled(false)
                setDialogBusy(false)

                if (iStatus >= 400) {
                    var oRawResponse = JSON.parse(oEvent.getParameter("responseRaw"));
                    showError(oRawResponse && oRawResponse.error && oRawResponse.error.message);
                } else {
                    MessageToast.show("Uploaded successfully");
                    oExtensionAPI.refresh()
                    closeDialog();
                }
            }
        };
    }

    return {
        onOpenFragment: function (oEvent) {
            MessageToast.show("Custom handler invoked.");
            this.loadFragment({
                id: "uploadDialog",
                name: "sravan.ust.media.ext.fragment.UploadDialog",
                controller: _createUploadController(this)
            }).then(function (oDialog) {
                oDialog.open();
            });
        }
    };
});
