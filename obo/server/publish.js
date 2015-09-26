Uploads.allow({
  'insert': function () {
    // add custom authentication code here
    return true;
  }, 
  'download': function(){
  	return true;
  }
});