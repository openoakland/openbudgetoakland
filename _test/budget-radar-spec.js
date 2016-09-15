
describe("ob.budget_radar", function () {
  var Radar = ob.display.budget_radar();  
  var axisVal = function (a, v) {
                                   return {    "axis" : a
                                             ,"value" : v }
                                };
  

  var testBudgetAxis1   = [ axisVal("a1", 1111)    // 40.49%
                          , axisVal("a2", 222)     // 8.09%
                          , axisVal("a3", 300)     // 10.93%
                          , axisVal("a4", 1111)];  // 40.49%



  var testBudgetAxis2 = [   axisVal("a1", 4321)    // 5.25%
                          , axisVal("a2", 1234)    // 1.50%
                          , axisVal("a3", 22222)   // 27.02%
                          , axisVal("a4", 2222)    // 2.70%
                          , axisVal("a5", 22222)   // 27.02%
                          , axisVal("a6", 3333)    // 4.05%
                          , axisVal("a7", 22222)   // 27.02%
                          , axisVal("a8", 33)      // 0.04%
                          , axisVal("a9", 4444)    // 5.40%
                        ];

  var allBudgetAxis  = [ testBudgetAxis1
                         , testBudgetAxis2];

  /* --------------------------------------------------
     Building a correct set of axis that are pleasing to
     the eye is more complex than it may first appear. 
    
     First, the 'all others' categories must be computed 
     independently for each axis.  Then after that, each
     element of 'all others' that is part of the difference
     set must be set to stand on its own and subtracted from 
     each.
          
  -------------------------------------------------- */





  

  var expectedResultAxis1 = [ axisVal("a1", 1111)    // 40.49%
                              , axisVal("a2", 222)     // 8.09%
                              , axisVal("a3", 300)     // 10.93%
                              , axisVal("a4", 1111)];  // 40.49%
  

  var expectedResultAxis2 = [ [
                                axisVal("a3"        , 22222)   // 27.02%
                              , axisVal("a5"        , 22222)   // 27.02%                              
                              , axisVal("a7"        , 22222)   // 27.02%
                              , axisVal("all others", 2222)    // 2.70%  
                              
                              ],
                              [  axisVal("a1", 1111)
                                , axisVal("a2", 222)     // 8.09%
                                , axisVal("a3", 300)     // 10.93%
                                , axisVal("a4", 1111)    // 40.49%
                              ]                              
                        ];


  var expectedResultAxisAll   = [[  axisVal("a1", 1111)    // 40.49% 
                                  , axisVal("a2", 222)     // 8.09%
                                  , axisVal("a3", 300)     // 10.93%
                                    , axisVal("a4", 1111)
                                    , axisVal("All Others", 0)  
                                 ],  // 40.49%
                                [   axisVal("a1", 4321)    // 5.25%  -- has to stay
                                  , axisVal("a2", 1234)    // 1.50%  -- has to stay
                                  , axisVal("a3", 22222)   // 27.02%
                                  , axisVal("a4", 2222)    // 2.70%  -- has to stay
                                  , axisVal("a5", 22222)   // 27.02%                         
                                  , axisVal("a7", 22222)   // 27.02%
                                  , axisVal("All Others", 7810)    // 9.4%                            
                                ]];
  var expectedResultAxisAsPercent = R.map(Radar.expressAsPercent, expectedResultAxisAll);
         
//  var allResultAxis = [axisVal("a1",4321)]
  
//  allBudgetAxis.push(testBudgetAxis1);
//  allBudgetAxis.push(testBudgetAxis2);
                     
   
  it("contains a spec for display", function () {
    var dictionary1   = Radar.makeAxisDictionary([testBudgetAxis1]) ;
    var dictionary2   = Radar.makeAxisDictionary([testBudgetAxis2]) ;

    var resultAxis    = Radar.buildUpAxisList(allBudgetAxis);
                                                 

    expect(dictionary1.size()).toBe(testBudgetAxis1.length);
    expect(dictionary2.size() ).toBe(testBudgetAxis2.length);
    expect(resultAxis.length).toBe(expectedResultAxisAsPercent.length);
    
    
  });

  it("has method axisNameMatch which determines axis as unique by name", function () {
    expect(Radar.axisNameMatch(axisVal("a1",1),axisVal("a1",1))).toBe(true);
    expect(Radar.axisNameMatch(axisVal("a1",1),axisVal("a1",0))).toBe(true);
    expect(Radar.axisNameMatch(axisVal("a1",0),axisVal("a2",0))).toBe(false);
  });
});
