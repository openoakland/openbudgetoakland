var keystone = require('keystone'),
	Types = keystone.Field.Types,
	slugify = require("underscore.string/slugify"),
	sections = require('./sections');

/**
 * Page Model
 * ==========
 */

var Page = new keystone.List('Page', {
	defaultColumns: 'title,section,content',
	defaultSort: 'section',
	track: true,
});

Page.add({
	title: { type: String, required: true, initial: true},
	slug: { type: String, watch: true, value: function(){
		return slugify(this.title);
	}},
	content: { type: Types.Html, wysiwyg: true, height: 300 },
	section: { type: Types.Select, emptyoption: true, options: sections}
});

/**
 * Registration
 */

Page.defaultColumns = 'title, content, section';
Page.register();
