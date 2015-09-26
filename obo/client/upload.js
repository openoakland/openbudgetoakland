// custom file upload provider for Orion using CollectionFS
orion.filesystem.providerUpload = function(options, success, failure, progress) {
    var files = options.fileList;
    _.each(files, function(file){
        Uploads.insert(file, function (err, fileObj) {
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            if (err) {
                failure(err);
            } else {
                // need to wait until the URL is ready to hand it back to Orion
                Tracker.autorun(function (c) {
                    // make the file a reactive data source
                    var thefile = Uploads.findOne(fileObj._id);

                    progress(thefile.uploadProgress() / 100);
                    
                    if (thefile.hasStored('uploads')){
                        success(thefile.url(), {fileId: thefile._id});
                        c.stop();
                    }
                });
            }
          });
    });
}

orion.filesystem.providerRemove = function(file, success, failure) {
    var thefile = Uploads.findOne(file.meta.fileId);
    thefile.remove(function(err, res){
        if (err) {
            failure(err);
        } else {
            success();
        }
    })
}
