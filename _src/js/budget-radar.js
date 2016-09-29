var ob     = ob || {};
ob.display = ob.display || {};
;(function(namespace, undefined) {
  namespace.budget_radar = function () {

    //--------------------------------------------------
    // SOFT Dependency check, some failure doesn't stop it
    //      but you will see a message in the log
    //      it goes by feel, so it can give false positives!
    //--------------------------------------------------
    var missingDeps = checkDependencies([   {target:R       ,expected:"object"},     //Ramda pkg 
                                            {target:ob.hash ,expected:"function"},   //Internal: Hash pkg
                                            {target:ob.data ,expected:"function"},   //Internal: Data pkg
                                        ]);
    if(missingDeps.length !== 0)
    {
      console.log("some dependencies appaer to be missing or mis-typed", missingDeps);
    }

    var Hash = ob.hash();
    


    //--------------------------------------------------
    // Good Defaults
    //--------------------------------------------------


    // Based on the standard page view model
    var _layout = {
      width:  800,
      height: 500,
      margin: {top: 100, right: 100, bottom: 100, left: 100}
    };

    var _palette = [
      '#970000',
      '#EDA400',      
      '#CD0059',
      '#395BF6',
      '#E23600',
      '#009F76',
      '#F07400',
      '#690180',
      '#008F16'
    ];
    
    var _threshold      = 0.07;    // The threshold comes from the page normally
    var margin          = _layout.margin;
    var _radar_selector = "#radar";    


    
    // don't want to rename and break the local convention
    // but this is a lot like a set of cursor functions
    // from XML 
    var _cruncher = ob.data.hierarchy()

    




    //--------------------------------------------------
    //INIT NULL
    //--------------------------------------------------
    var allBudgetAxis = []
    var _urls = [];
    
    // Hash comes from window screen. 
    var hash = Hash.parseWithDefault(["fy2016","fy2017"]);    


    var title = hash[0] + " " + hash[1];


    //--------------------------------------------------
    // Perform XHR request
    //--------------------------------------------------
    // Fetch the Data and draw the chart on return 
    // Expecting data to match the tree format    
    var createFunction = function () {
      buildAxisForUrl(_urls[0]);
      buildAxisForUrl(_urls[1]);
    };


    // XHR Request function


    var buildAxisForUrl = function (u){
      d3.json(u, function(data_incoming) {
        
        
        if(typeof data_incoming !== "undefined") {

          // convert the data into a nest structure
          // use the rollup function to accumulate amounts into a single level
          var topLevelBudgetValues = d3.nest()
              .key(function(data_incoming) { return data_incoming.agency; })
              .rollup(
                function(leaves) {
                  return {"amount": d3.sum(leaves,
                                           function(d) {
                                             return parseInt(d.value);})}})
              .entries(data_incoming);


          
          // Remove any budget values that don't comport (this really shouldn't happen)
          var filteredBudgetValues  = R.filter(validAxis, topLevelBudgetValues);

          
          var sortArrayByValue      = R.sort(diffValue)

          
          // Values are transformed into axis, then normalized, then thresholded. 
          var makeAxisArray         = R.compose( //  sortArrayByValue
            //                                                   , thresholdArrayAndAppend
            //                                                   , expressAsPercent
            treeDataToAxis);
          
          var budgetAxis            = makeAxisArray(filteredBudgetValues);

          // colors are incremented according to the pallete
          // new color is selected by the position of the new data plot
          // in the axis array
          //
          // color(0) -> #970000
          // so that is the color of the first plot
          var color = d3.scale.ordinal().range( _palette);


          // Add this set of data to the list of axis to consider


          allBudgetAxis.push(budgetAxis);

          // Format the budget axis according to our rules to make it purdy
          var renderableAxisListUnsorted = buildUpAxisList(allBudgetAxis);
          var renderableAxisList = R.map(function(arr) {
            // sort the data so the axis line up the same 
            arr.sort(function(a,b) {
              if (a.axis > b.axis) {
                return 1;
              }
              if (a.axis < b.axis) {
                return -1;
              }
              // a must be equal to b
              return 0;
            });
            
            return arr;
          },renderableAxisListUnsorted);

          
          var max   = getMaximum(renderableAxisList);

          var radarChartOptions = {
            w: _layout.width,
            h: _layout.height,
            margin: margin,
            maxValue: max,
            levels: 5,
            roundStrokes: true,
            color: color
          };


          //Call function to draw the Radar chart
          RadarChart(  "#radar"
                       , renderableAxisList
                       , ["fy2016","fy2017"]
                       , radarChartOptions);
          
          //Print chart title stupidly
          d3.select("#title").html(title);
          
        }


      });
    }

    
    //--------------------------------------------------
    // Non XHR dependent functions
    //--------------------------------------------------
    
    var thresholdArrayAndAppend = function (arr) {
      // return an array where the smallest results are filtered out, but then summed together
      // and turned into an extra "all others" axis.
      
      var aboveThresh       = R.filter (isAboveThreshold(_threshold), arr);
      
      var belowThreshValArr = R.filter(isBelowThreshold(_threshold))(arr);
      
      var belowThreshQty    = belowThreshValArr.length
      
      var belowThreshVal    = getSum(belowThreshValArr);
      
      var newOtherPoint     = {  axis:"All OTHERS (" + belowThreshQty + ")"
                                 , value: belowThreshVal};
      
      return R.insert( 0,  newOtherPoint, aboveThresh);
    };
    

    

    
    // A difference function specialized for axis
    var diffValue = function(o1,o2) { o1.value - o2.value}

    
    // Threshold functions to keep Axis count from getting to be too much                         
    var isAboveThreshold = R.curry(function (threshold,x) { return (x.value) > threshold});          
    var isBelowThreshold = R.curry(function (threshold,x) { return (x.value) <= threshold});



    
    var getSum = function (arr) {      
      var compareIncomingTakeSum = function (x,y) {return x + y.value;}
      // This is not a d3 reduction, it is a Ramdas one.
      // but the only real difference is the order of the initial condition
      // and the currying ability that Ramdas allows
      return (R.reduce(compareIncomingTakeSum
                       ,0
                       , arr));            
    };



    // specific form of getMaximum for axis
    var getMaximum = function (arr) {            
      var compareIncomingTakeMax = function (x,y) {return R.max( x, y.value);}
      var max = R.reduce( compareIncomingTakeMax ,  0 , arr);
      return max;
    }

    

    // normalize and express values as percent of the whole
    var expressAsPercent = function(arr) {                                                                         
      //Divide each value by the sum for a given array             
      var sum  = getSum(arr);
      var norm = function (x) { x.value = x.value / sum;
                                return x;};                                                 

      var normArr = (R.map(norm,arr));
      return normArr;
      
    };
    

    // apply the per element transform to every element in an array
    // producing our Axis
    var treeDataToAxis = function (arr) {
      return R.map(elementToAxis,arr);}



    
    var elementToAxis = function (o) {
      // The data we are taking in is in our standard
      // Budget tree form, but d3 radar requires
      // Elements to have a form as below



      return  {   axis:  o.key
                  , value:  o.value.amount};
      
    };

    var makeAxisFromMap    = function (axisMap) {
      // A lot of these combinations functions are
      // easier to run on map datastructures
      // but the radar wants [{"axis":<name>, "value":<number>}]

      var finalMap = ob.data.maps().mapWithKey(function(v,k) {
        return {"axis":k, "value":v};
      }
                                               ,axisMap);
      return finalMap.values();
      
    };

    var makeInputMap       = function (arrayOfAxis) {
      // Take an array of axisArrays and turn it into
      // an array of axis maps
      // Expected form of dtaa is [[({"key":<axis-key>, "value":<axis-val>})]]

      
      // These two functions are useful in transforming axisArrays of values
      // into maps of normalized values
      var makePercentAxis = R.map(expressAsPercent);
      var makeArrayOfMaps = R.map(makeAxisMap);


      var inputMaps       = R.compose( makeArrayOfMaps
                                       , makePercentAxis) (arrayOfAxis);
      
      return inputMaps;      

    };
    
    var makeAxisDictionary = function (arrayOfAxis) {
      // compute the set of axis that are valid for
      // this budget radar
      //
      // Expected form of dtaa is [[({"key":<axis-key>, "value":<axis-val>})]]



      var inputMaps       = makeInputMap(arrayOfAxis);

      var emptyMap        = d3.map();


      
      var makeDictionary  = function (dict,next) {
        var outMap  = ob.data.maps().combineMapsWith(dict,next,function(v1,v2)
                                                     {
                                                       if(v1 >= v2) {
                                                         return v1;
                                                       }
                                                       else
                                                       {
                                                         return v2;
                                                       }
                                                     });
        return outMap; };


      var finalAxisDict   = R.reduce(makeDictionary,emptyMap,inputMaps);

      return finalAxisDict;
      
    };

    var axisNameMatch = R.curry(function (a1,a2) {
      return a1.axis === a2.axis;
    });


    var makeAxisMap = function(axisArray) {      

      var fixValue  = function(v,k) { return v.value;}
      var mapSimple = d3.map(axisArray, function (d) { return d.axis});      
      var axisMap   = ob.data.maps().mapWithKey(function(d){
        return d.value;
      }, mapSimple);

      return axisMap;
    };


    
    var buildUpAxisList = function (axisArray) {
      // This is where the axis from each data set
      // are compared against each other to build up
      // a set of axis that can be appropriate and common to all
      // entries.

      // To start with a dictionary is made (1) this allows
      // quick lookup for all axis values.

      // Then the axisArray are traversed. (2)
      //
      // If the axis in the array contains a value above the threshold
      // the value is added to the map that will represent the final output
      // map for this data
      //
      // If the axis in the array yields a value less than the
      // threshold in the dictionary.  The value is added to the
      // 'all others' entry for that map.

      // at the end all the maps are converted back into axis arrays (3).



      // 1. Create axis dictionary.
      var axisDictionary = makeAxisDictionary(axisArray);


      // 2. Transform Axis array.
      var inputMaps  = makeInputMap(axisArray);

      var outputMaps = R.map(function(axisMap) {
        var outputMap  = d3.map().set("All Others",0);
        axisMap.each(function(v,k) {
          if(axisDictionary.get(k) >= _threshold)
          {
            outputMap.set(k,v);
          }
          else
          {
            outputMap = ob.data.maps().combineMapsWith( outputMap
                                                        , d3.map().set("All Others",v)
                                                        , function(v1,v2) { return v1 + v2;})
            
          }

          
          
        });

        return outputMap;
        
      },inputMaps);

      
      // Add 0 value axis to each inputMap
      
      // Create a zero valued dictionary 
      var mergeDictionary     = R.reduce(ob.data.maps().unionMaps, d3.map(), outputMaps);
      var nullMergeDictionary = ob.data.maps().mapWithKey(function (v,k) { return 0;},mergeDictionary);

      
      var axisAdjustedOutputMaps = R.map(function(map) {
        var final = ob.data.maps().unionMaps(map, nullMergeDictionary);
        return final;
      },outputMaps);


      
      // 3. Convert back to axis array.
      var outputAxisArrays = R.map(function (map) {
        return makeAxisFromMap(map);
      }, axisAdjustedOutputMaps);

      return outputAxisArrays;


    };

    
    
    //--------------------------------------------------
    // Data Validation
    //--------------------------------------------------

    // combine has filters together in one check
    var validAxis = function (o) {
      //--------------------------------------------------
      // 'has' filters to validate incoming data and eliminate anything weird
      //--------------------------------------------------
      var hasKey    = R.has("key");
      var hasAmount = R.has("amount");
      return hasKey(o) && hasAmount(o.value); }; 




    
    
    //--------------------------------------------------
    // Return config Object
    //--------------------------------------------------
    return { create: createFunction,
             width: function() {
               if (arguments.length) {
                 _layout.width = arguments[0];
                 return this;
               }
               return _layout.width;
             },
             height: function() {
               if (arguments.length) {
                 _layout.height = arguments[0];
                 return this;
               }
               return _layout.height;
             },
             urls: function() {
               if (arguments.length) {
                 _urls = arguments[0];
                 return this;
               }
               return _url;
             },
             threshold: function() {
               if (arguments.length) {
                 _threshold = arguments[0];
                 return this;
               }
               return _threshold;},
             axisNameMatch: axisNameMatch,
             makeAxisDictionary: makeAxisDictionary,
             makeAxisFromMap: makeAxisFromMap,
             buildUpAxisList: buildUpAxisList,
             expressAsPercent: expressAsPercent
           };





  }
})(ob.display);

