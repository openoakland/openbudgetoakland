var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Page Model
 * ==========
 */

var Page = new keystone.List('Page');

Page.add({
	title: { type: String, required: true, initial: true},
	content: { type: Types.Html, wysiwyg: true, height: 300 }
});

/**
 * Registration
 */

Page.defaultColumns = 'title, content';
Page.register();
