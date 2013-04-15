$(function() {
    var state = {
	"drilldowns": [
	    "department",
	    "unit",
	    "child-fund"
	],
	"cuts": {"time.year": "2011|time.year:2012"}
    };
    var context = {
	dataset: "oakland-adopted-budget-fy-2011-13-expenditures",
	siteUrl: "http://openspending.org",
	embed: true
    };
    window.wdg_widget = new OpenSpending.Treemap($('#treewidget11-13'), context, state);	
});	