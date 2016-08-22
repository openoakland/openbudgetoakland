var ob     = ob || {};
ob.display = ob.display || {};
;(function(namespace, undefined) {
 
  /* Budget Levels define functions to pick and set data in a 
     more functional style.

     It uses ramdas to accomplish this task.


     The data for the budget is assumed to be recursive and in this form:
      <budget-object> :
      ----------------------------------
        { key:  <string-literal>
        , data: { revenue: <number>
                , expense: <number>
                , amount:  <number> }
      
        , values: [<budget-object>] }



     -------------------------------------
     our api functions using keys to access data layers.

     ie:
       
     budgetObject = { key:"foo", data..., values[{key:"bar" ...}]}

     to operate on this data, use:
     var lens     = BL().lens;
     var viewElements = BL().viewElements;
     var key          = BL().key;
     var mapped       = BL().mapped;

     lens(key("foo"),mapped,key("bar"));

     lets say we want to bring it to the top level.
     
     var elements = viewElements(lens(key("foo"),mapped,key("bar")),budgetObject);
     $> [{key:"bar",...}]
    
    
  */


  
  
  namespace.BL = function () {


    //--------------------------------------------------
    // SOFT Dependency check, failure doesn't stop it
    //--------------------------------------------------
    var missingDeps = checkDependencies([   {target:R       ,expected:"object"},                                            
                                        ]);

    var lens
    return {};
  } 

});  
