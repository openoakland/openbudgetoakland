$(function() {
    // Default drilldowns and cuts and year
	var defaultYear = 2013;
    var drilldowns = ["fund", "department", "unit"];

	//Default year cuts
    var cuts = {"time.year": "2013"};
	//Default header text
	var headerText = "Mayor's Proposed Spending"


    // Get url parameters (this could be easily parsed, but we use purl)
    // Purl is available here: https://github.com/allmarkedup/jQuery-URL-Parser
    var parameters = $.url().param();


	//check for 'reference_years' in URL parameters
	//argument must be formatted with four digit years, eg. 2012
	//separate multiple years with a '+' symbol, but you need only supply one
	//the cuts used by default would correspond to: reference_years=2013+2014

	if(parameters['reference_years'])
	{
		//initialize the string to be formatted, and separate the years from the argument

		var cutString = "";
		headerText = "";
		var years = parameters['reference_years'].split(" ");
		var i = 0;

		//loop through the list of years

		$.each(years, function(index, value){
			//the first argument has nothing preceding it
			if(i!=0)
			{
				//after the first, prepend the new cut and the '|' to perform and addition
				cutString += "|time.year:";
				headerText += " & ";
			}
			//add the year
			cutString += value;
			headerText += value;
			i++;
		});
		//apply the formatted cuts string
		cuts = {"time.year": cutString};
		headerText += " Mayor's Proposed Spending";
	}


	$('#year-header').html(headerText);
    // Start collecting breadcrumbs. We begin with Funds (base url)
    var path = $.url().attr('path');
    var crumbs = [{path:path, title:'Funds'}];

    // While the first drilldown is in the url parameters
    // we move it to the cuts instead
    while(drilldowns[0] in parameters) {
	var drill = drilldowns.shift();
	cuts[drill] = parameters[drill];
	// Add crumb to our crumbs.
	// The path is computed from the preceeding crumb but we add
	// the new url parameter for this particular crumb
	crumbs.push({path:[crumbs[crumbs.length-1].path,
			   (crumbs.length > 1) ? '&' : '?',
			   drill, '=', parameters[drill]].join(''),
		     title:parameters[drill]
		    });
    }

    // Create the links for our crumbs
    var breadcrumbs = [];
    for (var idx in crumbs) {
	breadcrumbs.push('<a href="'+crumbs[idx].path+'">'+
			 crumbs[idx].title+'</a>');
    }
    // Add our breadcrumbs to the page (to an element with id #breadcrumbs
    $('#breadcrumbs').html(breadcrumbs.join(' > '));

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
		// Then we have to check if we need to add ? or &
		// (it depends on if there are any url parameters present).
		// The url parameter is of the form dimension=name
		var new_location = [window.location.href,
				    window.location.search ? '&' : '?',
				    drilldowns[0], '=',
				    encodeURIComponent(node.name)];
		// Go to the new location
		window.location.href = new_location.join('');
	    }
	    // If the node doesn't have children we notify the user
	    else
	    {
		// This can be made more beautiful
		alert("That's as low as we go.");
	    }
	}};
    // Create the Treemap
    // HACK: Override $jit.Trans.Expo.easeOut transition when it's loaded to eliminate animation
    window.wdg_widget = new OpenSpending.Treemap($('#treewidget13-15'), context, state);
});