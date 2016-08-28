describe("ob.data", function () {
  var M = ob.data.maps();
  
  var fixValue = function (v,k) {
    return v.value;
  };

  
  var testArr1 =  [{"key": "test7" , "value" : 100},
                   {"key": "test6" , "value" : 105},
                   {"key": "test5" , "value" : 110},
                   {"key": "test0" , "value" : 115},
                   {"key": "test1" , "value" : 120},
                   {"key": "test2" , "value" : 125},
                   {"key": "test3" , "value" : 130},
                   {"key": "test4" , "value" : 135}];
  
  var testMap1 = M.mapWithKey(fixValue,d3.map(testArr1,function(v){ return v.key;}));

  

  var testArr2 =  [{"key": "test0" , "value" : 200},
                   {"key": "test1" , "value" : 5},
                   {"key": "test2" , "value" : 110},
                   {"key": "test3" , "value" : 115},
                   {"key": "test4" , "value" : 20},
                   {"key": "test5" , "value" : 225},
                   {"key": "test8" , "value" : 225},
                   {"key": "test6" , "value" : 135}];
  
  var testMap2 = M.mapWithKey(fixValue, d3.map(testArr2,function(v){ return v.key;}));

  var newMap = M.combineMapsWith(testMap1, testMap2, R.max);


  it("has a method combineMapsWith that unions maps", function() {
    expect(newMap.get("test0")).toBe(200);
    expect(newMap.get("test1")).toBe(120);
    expect(newMap.size()).toBe(9);
  });

  
});
