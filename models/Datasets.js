var keystone = require('keystone'),
	Types = keystone.Field.Types,
	// slugify = require("underscore.string/slugify"),
	transforms = require('./VizTypeTransformScripts.js'),
	_ = require('underscore');

/**
 * Dataset Model
 * ==========
 */

var Dataset = new keystone.List('Dataset', {
	// defaultColumns: 'title,section,content',
	// defaultSort: 'section',
	track: true,
});

Dataset.add({
	year: { type: Types.Number, 
		required: true, 
		initial: true,
		note: "Enter the year in which the Fiscal Year starts (Oakland FYs run July-June)",

	},
	sourcefile: { type: Types.S3File, 
		allowedTypes: ['text/csv'],
		note: "Must be a CSV file",
		filename: function(item, filename){
			// prefix with the path
			return 'datasets/' + filename;
		}
	}
});


/**
 * Middleware
 */

Dataset.schema.post('save', function(doc){
	// apply the exported transforms
	_.each(transforms, function(t){
		t(doc);
	})
})


/**
 * Registration
 */

// Dataset.defaultColumns = 'title, content, section';
Dataset.register();
