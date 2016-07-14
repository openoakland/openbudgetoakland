var ob = ob || {};
;(function(namespace, undefined) {
  /* Routines to manipulate the hash 
     on the window address

     hashing in our budget data corresponds to
     keys in the budget values. e.g.
     
    #fy14-15.expense.fy14-15.generalfund.generaloperations-uasn      
    
    produces
    a keys array: [fy14-15,expense,fy14-15,generalfund,generaloperations-uasn]       

     
  */

  
  namespace.hash = function() {

    var _s = '.';

    var _normalize = function (s) {
      return s.toLowerCase().replace(/\s+/g, '')}
    var _separator =  function(s) {
	_s = s;
    };

    var _parse = function() {
	if (window.location.hash.length < 2) {
	  return [];
	}
	var str = window.location.hash;
	str = str.replace("#","");
	var keys = str.split(_s);
	return keys;
    };
    var _parseWithDefault = function(default_) {
        
	if (window.location.hash.length < 2) {
	return default_
	}
	var str = window.location.hash;
	str = str.replace("#","");
	var keys = str.split(_s);
	return keys;
      }
    return {
      separator: _separator,
      parse: _parse ,
      parseWithDefault: _parseWithDefault,
      set: function(keys) {
      },
      normalize: _normalize
      ,
      compare: function (v1, v2) {
        return _normalize(v1) == _normalize(v2) ? 0 : 1
      }



    };
  }
})(ob);
