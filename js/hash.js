var ob = ob || {};

;(function(namespace, undefined) {
	namespace.hash = function() {

		var _s = '.';

		return {
			separator: function(s) {
				_s = s;
			},
			parse: function() {
				if (window.location.hash.length < 2) {
					return [];
				}
				var str = window.location.hash;
				str = str.replace("#","");
				var keys = str.split(_s);
				return keys;
			},
			set: function(keys) {
			}



		};
	}
})(ob);
