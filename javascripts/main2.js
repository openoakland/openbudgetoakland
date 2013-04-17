$(function() {
    // Default drilldowns and cuts
    var drilldowns = ["department", "unit", "fund"];
    var cuts = {"time.year": "2013|time.year:2014"};

    // Get url parameters (this could be easily parsed, but we use purl)
    // Purl is available here: https://github.com/allmarkedup/jQuery-URL-Parser
    var parameters = $.url().param();
    
    // While the first drilldown is in the url parameters
    // we move it to the cuts instead
    while(drilldowns[0] in parameters) {
	var drill = drilldowns.shift();
	cuts[drill] = parameters[drill];
    }

    // Create the state from the (possibly modified) drilldowns and cuts
    var state = {
	"drilldowns": drilldowns,
	"cuts": cuts
    };

    var context = {
	dataset: "mayor_s_proposed_policy_budget_fy2013-15",
	siteUrl: "http://openspending.org",
        drilldown: function(node) { // Gets called on node click
	    // If the node has children we can drill more
	    if (node.data.node.children.length) {
		// We create a new location by adding a url parameter
		// The we have to check if we need to add ? or &
		// (it depends on if there are any url parameters present).
		// The url parameter is of the form dimension=name
		var new_location = [window.location.href,
				    window.location.search ? '&' : '?',
				    drilldowns[0], '=', node.name];
		// Go to the new location
		window.location.href = new_location.join('');
	    }
	    // If the node doesn't have children we notify the user
	    else 
	    { 
		// This can be made more beautiful
		alert("Sorry, we can't dig deeper");
	    }
	}};
    // Create the Treemap
    window.wdg_widget = new OpenSpending.Treemap($('#treewidget13-15'), context, state);	
});