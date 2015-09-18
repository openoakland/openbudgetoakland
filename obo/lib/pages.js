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
    columns: [
      { data: "title", title: "Title" },
      /**
       * If you want to show a custom orion attribute in
       * the index table you must call this function
       * orion.attributeColumn(attributeType, key, label)
       */
      // orion.attributeColumn('file', 'image', 'Image'),
      // orion.attributeColumn('summernote', 'body', 'Content'),
      // orion.attributeColumn('createdBy', 'createdBy', 'Created By')
    ]
  }

});

Pages.attachSchema(new SimpleSchema({
	title: {
		type: String
	},
	body: orion.attribute('summernote', {
		label: 'Body'
	})
}));