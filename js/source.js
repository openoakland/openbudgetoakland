var ob = ob || {}

;(function(namespace, undefined) {
	namespace.fusion = function(api_key, table_id) {
		return {
			key: api_key,
			table: table_id,

			url: function(hierarchy, sum) {
				/* quote columns */
				var columns = hierarchy.map(function(x) { return "'" + x + "'"; });

				/* build query */
				var query = 'SELECT ' + columns.join(',');
				if (sum) { query += ',Sum(' + sum + ')'; }
				query += ' FROM ' + this.table + ' GROUP BY ' + columns.join(',');

				/* encode query */
				query = encodeURIComponent(query);

				/* build url */
				var url = 'https://www.googleapis.com/fusiontables/v1/';
				url += 'query?sql=' + query;
				url += '&key=' + this.key;
				return url;
			},
		};
	}
})(ob);

/* test
var x = ob.fusion(
		'AIzaSyCnWo1USrkSKnN6oy02tNeWfg6aFSg0OI8',
		'1V2R7lsdg-GTbGOZ_h_DrGOa-Gfqk1PGA9h_n5zwU'
		);
console.log(
	x.url(
			['Fund Description', 'Department', 'Division'],
			'Amount'
		)
);

x.key = 'xxxxx'
console.log(
	x.url(
			['Fund Description', 'Department', 'Division'],
			'Amount'
		)
);
*/
