/*
checkDependencies is very very light weight dependency checking.

use:
var missingDeps = checkDependencies([   {target:R,expected:"object"}]);

if everything is as it should be, you will get back a missingDeps of length 0.
*/

var checkDependencies = function(deps) {


    var runDepsCheck = function() {
        
        var hasTarget    = R.has("target");
        var hasExpected  = R.has("expected");
        var isWellFormed  = function (x) {return  hasExpected(x) && hasTarget(x);};

        var evaluateDep  = function(x) { return isWellFormed(x) && typeof x.target == x.expected } ;
        var valueReducer = (function (vals,target)  {
            if(evaluateDep(target) ) {
                return vals;
            }
            else {
                return (R.insert(0, target, vals));
            }
                
            
        });
        var unfilledDeps = R.reduce(  valueReducer
                                      , []
                                      , deps);

        return unfilledDeps;
                                     
    }


    //First boot strap the dependencies this thing needs.
    if(typeof R === "object")
    {
        //       runDepsCheck();
        return [];
    }
    else
    {
        console.log("need ramda.min.js to work");
    }
        

}
