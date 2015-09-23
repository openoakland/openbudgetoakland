Pages = new orion.collection('pages', {
  singularName: 'page', // The name of one of these items
  pluralName: 'pages', // The name of more than one of these items
  link: {
    /**
     * The text that you want to show in the sidebar.
     * The default value is the name of the collection, so
     * in this case it is not necessary.
     */
    title: 'Pages' 
  },
  /**
   * Tabular settings for this collection
   */
  tabular: {
    // here we set which data columns we want to appear on the data table
    // in the CMS panel
    columns: [
      { 
        data: "title", 
        title: "Title" 
      },{ 
        data: "contents", 
        title: "Contents" 
      }
    ]
  }

});

Pages.attachSchema(new SimpleSchema({
	role: {
    type: String,
    allowedValues: ['homepage', 'vizualizations']
  },
  title: {
		type: String,
    label: 'Page Title'
	},
	contents: orion.attribute('summernote', {
		label: 'Page Content'
	})
}));
