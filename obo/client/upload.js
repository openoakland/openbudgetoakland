orion.filesystem.providerUpload = function(options, success, failure, progress){
	/* If success, call success(publicUrl);
	 * you can pass data and it will be saved in file.meta
	 * Ej: success(publicUrl, {local_path: '/user/path/to/file'})
	 *
	 * If it fails, call failure(error).
	 *
	 * When the progress change, call progress(newProgress)
	 */
	 // debugger;
	 var files = options.fileList;
	 _.each(files, function(file){
		Uploads.insert(file, function (err, fileObj) {
	        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
	        if (err) {
	        	failure(err);
	        } else {
	        	// need to wait until the URL is ready to hand it back to Orion
	        	Tracker.autorun(function () {
	        		var thefile = Uploads.findOne(fileObj._id);
	        		progress(thefile.uploadProgress());
	        		if (thefile.isUploaded()){
	        			success(thefile.url());
	        		}
	        	});
	        	
	        }
	      });
	});
}


