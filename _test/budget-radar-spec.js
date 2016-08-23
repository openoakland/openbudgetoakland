
describe("ob.budget_radar_", function () {
  
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


  var allBudgetAxis   = [];
  
  allBudgetAxis.push(testBudgetAxis1);
  allBudgetAxis.push(testBudgetAxis2);
                     
   
  it("contains a spec for display", function () {
      expect(testBudgetAxis1 ).toBe(testBudgetAxis1);
      expect(testBudgetAxis2 ).toBe(testBudgetAxis2);
      expect(allBudgetAxis   ).toBe(allBudgetAxis);
  });
  
});
