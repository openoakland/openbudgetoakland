var keystone = require('keystone'),
	Types = keystone.Field.Types,
	slugify = require("underscore.string/slugify");

/**
 * VizType Model
 * ==========
 */

var VizType = new keystone.List('VizType', {
	sortable: true,
	track: true,
});

VizType.add({
	name: { type: String, required: true, initial: true},
	slug: { type: String, watch: true, value: function(){
		return slugify(this.name);
	}},
	homepage_title: { type: String, label: 'Homepage Title' },
	homepage_subtitle: { type: String, label: 'Homepage Subtitle' },
	homepage_image: { type: Types.CloudinaryImage, label: 'Homepage Image', autoCleanup: true },
});

/**
 * Registration
 */

VizType.defaultColumns = 'name, homepage_title, homepage_subtitle';
VizType.register();
