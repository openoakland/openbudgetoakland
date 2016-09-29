var ob = ob || {};
ob.data = ob.data || {};

;(function (namespace, undefined) {





  




  
  /* --------------------------------------------------
     General Nest Related functions


     These methods are very important to understand in order to traverse the data.

     The  data in the OKC Budget is in this recursive structure: 

     <budget-object>
     --------------------------------------------------
     { key:  <string-literal> , 
     data: { revenue: <number>,
     expense: <number>,
     amount:  <number>}
     values: [<budget-object>]  }                            

     --------------------------------------------------

     Recursive structures can be a mess to deal with.

     For this reason, the following helper functions are defined


  */






  namespace.accumulate = function (d){
    // Aggregate the values for internal nodes. This is normally done by the
    // treemap layout, but not here because of our custom implementation.
    // We also take a snapshot of the original children (_children) to avoid
    // the children being overwritten when when layout is computed.
    return (d._children = d.values)
      ? d.value = d.values.reduce(function(p, v) { return parseInt(p) + namespace.accumulate(v); }, 0)
    : parseInt(d.value);
  }




  //get the index of a node that matches a given value
  // using the provided comparitor
  namespace.findIndex = function(array, value, comparitor) {
    /* apparently this method will be part of the js array in future
       browser releases, but it is not supported right now */
    for (var idx = 0; idx < array.length; idx++) {
      if (comparitor(array[idx], value) == 0) {
        return idx;
      }
    }
    return -1;
  }



  
  /* -- --------------------------------------------------
     Hierarchy (More nest but very custom)
     
     This is where you go to find functions to go down the levels.
     
  */
  namespace.hierarchy = function() {

    /* helper function for preparing data for visualization */
    function _prepare_recurse(node) {
      /* nodes need to have 'children' in order to work with calls to
	 d3.layout.partition
      */

      /* hold sum of child values */
      var value = {
	income: 0.0,
	expense: 0.0,
	balance: 0.0
      };

      
      /* recurse through children of node */
      node.values.forEach(function(child) {
	child.depth = node.depth + 1;
	child.parent = node;
	/* 'values' either contains the budget amount for a node,
	   or it contains a list of sub nodes.  This code checks
	   whether 'values' is an array or a number.  If it is a
	   number it accumulates it, otherwise it continues to
	   process the children
	*/
	if (child.hasOwnProperty('values')) {
	  if (isNaN(child.values)) {
	    if (child.values instanceof Array) {
	      /* for visualization code, need to set children variable */
	      //child.children = child.values;
	      var child_value = _prepare_recurse(child);
	      value.income += child_value.income;
	      value.expense += child_value.expense;
	      value.balance += child_value.balance;
	    }
	  }
	  else {
	    /* parse integer of child values */
	    child.income = 0.0;
	    child.expense = 0.0;
	    child.balance = 0.0;
	    var total = parseFloat(child.values);
	    /*child.value = parseFloat(child.values);*/
	    if (total < 0.0) {
	      child.income = -1.0 * total
	      value.income += child.income;
	    }
	    else {
	      child.expense = total;
	      value.expense += child.expense;
	    }
	    /*
	      if (child.value < 0.0) {
	      child.income = -1.0 * child.value;
	      value.income += child.income;
	      }
	      else {
	      child.expense = child.value;
	      value.expense += child.expense;
	      }
	    */
	    child.balance = child.expense - child.income;
	    value.balance += child.balance;
	    delete child.values;
	  }
	}
      });

      /* assign the value for this node as the sum of the child values */
      node.balance = value.balance;
      node.value = node.balance;
      node.income = value.income;
      node.expense = value.expense;

      /* sort child values */
      node.values.sort(function(a, b) {
	return b.balance - a.balance;
      });

      /* return this nodes value */
      return value;
    }

    /* process the return to d3.nest so that it can be displayed */
    function _prepare(data) {
      var root = {
	key: 'Budget',
	depth: 0,
	values: data
      };
      _prepare_recurse(root);
      return root;
    }




    return {
      crunch: function(rows, order) {
	/* d3.nest takes the row data given by fusion tables and converts it into
	   hierarchical data needed for our visualization.  Accumulate
	   and nest data to depth determined by 'heirarchy'
	*/
	var amount_pos = order.length;
	var nest = d3.nest();
	d3.range(order.length)
	  .forEach(function(i) {
	    /* recursively apply hierarchy keys */
	    nest = nest.key(function(d) { return d[i]; });
	  });

	/* when rolling up child data into group, sum their values */
	nest = nest.rollup(function(d) {
	  var sum = 0.0;
	  d.forEach(function(x) {
	    sum += parseFloat(x[amount_pos]);
	  });
	  return sum;
	}).entries(rows);


	/* prepare data for visualization */
	var root = _prepare(nest);
	//root.values = root.children;
	return root;
      },
      spelunk: function(root, keys, cmp) {
        if (arguments.length < 3) {
          cmp = function(v1, v2) { v1 == v2 ? 0 : 1; }
        }
	var node = root;
	/* make copy of keys */
	var p = keys.slice();
	while (p.length > 0) {
	  var next_key = p.shift();
	  var next_node = null;
	  node.values.forEach(function(c) {
	    if (cmp(c.key, next_key) == 0) {
	      next_node = c
	    }
	  });
	  if (!next_node) {
	    return node;
	  }
	  node = next_node;
	}
	return node;
      },
      path: function(node) {
	var p = [];
	while (node) {
	  p.unshift(node);
	  node = node.parent;
	}
	return p;
      },
      apply: function(node, func) {
	var self = this;
	func(node);
	if (node.values) {
	  node.values.forEach(function(x) {
	    self.apply(x, func);
	  });
	}
      }
    };
    
  }



  


  //--------------------------------------------------
  // Map functions
  //-------------------------------------------------- 
  namespace.maps = function () {
    var mapsOutput = {};


    // mapWithKey : (f(v0,k) -> v1 ) -> Map k v0 -> Map k v1
    // change the value of a map... I keep messing this up
    // so abstraction!
    var mapWithKey = function (modFunction, map) {
      var finalmap = d3.map();
      map.each(function(v,k,m){
        
        finalmap.set(  k , modFunction(v,k));

        

      });
      return finalmap;
    };


    /* combine two d3 maps together with a comparison function */
    /* if a key is present in both maps the comparison function:
       f(v1,v2) -> v'  determines how the result should be combined              

    */    
    var combineMapsWith = function (map1, map2, f) {


      var finalCombinedMap = d3.map(map1); // empty map to return final result 
      var map2_prime = d3.map(map2);   //copy map for mutability



      
      // Run through all the keys in map1 comparing with map2
      // run the combination function on collision 
      map1.each(function(v,k,m) {        

        var rslt2 = map2_prime.get(k);        


        
        if (typeof rslt2 === "undefined")
        {
          map2_prime.remove(k); // this is why the map is copied
        } else
        {

          var finalResult =  f(v,rslt2);
         


          finalCombinedMap.set(k,finalResult);
          map2_prime.remove(k);
        }


      });

      


      // Run through the keys in map2 that haven't been destroyed
      // by the previous routine.
      // add each of them to our finalMap
      map2_prime.each(function(v,k,m) {        
        var rslt2 = map2_prime.get(k);

        finalCombinedMap.set(k, v);
        
      });
      

      return finalCombinedMap;

      
    }

    var unionMaps = function (map1,map2) {
      // combineMapsWith using a default function to combine
      // two maps with the following rules.
      // kL == kR -> vL
      // kL == null , kR == v -> v
      // kL == v , kR == null -> v
      var final = combineMapsWith(map1,map2, function(v1,v2) { return v1});
      return final;
    };
   
    
    mapsOutput.combineMapsWith = combineMapsWith;
    mapsOutput.mapWithKey      = mapWithKey;
    mapsOutput.unionMaps       = unionMaps;
    return mapsOutput;



  };
  
})(ob.data);
