var d3 = require('d3'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert'),
	AWS = require('aws-sdk'),
	s3 = new AWS.S3();

require('dotenv').load();

var flow = function(doc){
	// transform data table to the node/link structure
	// required by the D3 Sankey plugin
	if (! doc.sourcefile.filename) { return; }

	var csvfile = doc.sourcefile.filename;
	s3.getObject({Bucket: process.env.S3_BUCKET, Key: csvfile}, function (err, data) {
		if (err) {
			console.log(err, csvfile);
			return;
		}

		var dataset = d3.csv.parse(data.Body.toString('utf-8'));
		rev_order = [
	      // keep variations of the same label on a single line
	      "Property Tax", 
	      "Business License Tax", 
	      "Sales Tax",
	      "Utility Consumption Tax", 
	      "Real Estate Transfer Tax",
	      "Fines & Penalties", 
	      "Parking Tax", 
	      "Transient Occupancy Tax",
	      "Service Charges", 
	      "Transfers from Fund Balance", 
	      "Miscellaneous Revenue", 
	      "Interest Income", 
	      "Licenses & Permits",
	      "Interfund Transfers", 
	      "Grants & Subsidies", 
	      "Local (Parcel) Taxes", "Local Tax", 
	      "Internal Service Funds",
	      "Gas Tax",
	      ];

	      // get revenue rows
	      rev = dataset.filter(function(v,i,a){
	      	return v.account_type == "Revenue";
	      });

	      // group revenue rows by category
	      revcats = d3.nest()
	      .key(function(d){
	      	return d.account_category;
	      })
	      .sortKeys(function(a,b){
	      	return rev_order.indexOf(a) - rev_order.indexOf(b);
	      })
	      .key(function(d){
	      	if (d.fund_code == "1010") {
	      		return "General Fund";
	      	} else {
	      		return "Non-discretionary funds";
	      	}
	      })
	      .rollup(function(v){
	      	var values = v;
	      	values.total = d3.sum(values, function(d){
	      		return +d.amount;
	      	});
	      	return values;
	      })
	      .entries(rev);

	      // initialize nodes with funds
	      nodes = [{"name": "General Fund", "type": "fund", "order": 0}, {"name": "Non-discretionary funds", "type": "fund", "order": 1}];
	      nodeoffset = nodes.length;
	      
	      links = [];

	      for (var i = 0; i < revcats.length; i++){
	      	// add revenue categories to nodes
	      	nodes.push({"name": revcats[i].key, "type": "revenue"});
	      	
	      	// add links to funds from each revenue category node
	      	for (var x = 0; x < revcats[i].values.length; x++) {
	      		var link = {
	      			"source": i + nodeoffset,
	      			"value": revcats[i].values[x].values.total,
	      		};
	      		if (revcats[i].values[x].key == "General Fund"){
	      			link.target = 0;
	      		} else if (revcats[i].values[x].key == "Non-discretionary funds") {
	      			link.target = 1;
	      		}
	      		links.push(link);
	      	}

	      }

	      // get Expense rows from dataset
	      exp = dataset.filter(function(v,i,a){
	      	return v.account_type == "Expense";
	      });

	      // custom sort order
	      exp_order = [
	        // keep variations of the same label on a single line
	        "Police Department", "Police",
	        "Fire Department", "Fire",
	        "City Council",
	        "Administrative Services",
	        "Oakland Parks & Recreation",
	        "Human Services",
	        "City Auditor",
	        "Community Services",
	        "Information Technology",
	        "Finance",
	        "City Clerk",
	        "Capital Improvement Projects",
	        "Mayor",
	        "Economic & Workforce Development",
	        "City Administrator",
	        "Human Resources Management",
	        "Planning & Building",
	        "City Attorney",
	        "Housing & Community Development",
	        "Library", "Oakland Public Library",
	        "Public Works", "Oakland Public Works",
	        "Debt Service & Misc."
	        ];

	        // group expense rows by department
	        expdivs = d3.nest()
	        .key(function(d){
	        	if (d.department == "Non-Departmental") {
	        		return "Debt Service & Misc."
	        	}
	        	return d.department;
	        })
	        .sortKeys(function(a,b){
	        	return exp_order.indexOf(a) - exp_order.indexOf(b);
	        })
	        .key(function(d){
	        	if (d.fund_code == "1010") {
	        		return "General Fund";
	        	} else {
	        		return "Non-discretionary funds";
	        	}
	        })
	        .rollup(function(v){
	        	var values = v;
	        	values.total = d3.sum(values, function(d){
	        		return d.amount;
	        	});
	        	return values;
	        })
	        .entries(exp);
	        

	        for (var i = 0; i < expdivs.length; i++){
	        	// add departments to nodes
	        	nodes.push({"name": expdivs[i].key, "type": "expense"});
	        	
	        	for (var x = 0; x < expdivs[i].values.length; x++) {
	        		// add links from funds to each department node
	        		var link = {
	        			"target": i + nodeoffset + revcats.length,
	        			"value": expdivs[i].values[x].values.total,
	        		};
	        		if (expdivs[i].values[x].key == "General Fund"){
	        			link.source = 0;
	        		} else if (expdivs[i].values[x].key == "Non-discretionary funds") {
	        			link.source = 1;
	        		}
	        		links.push(link);
	        	}
	        }

	    // Store the nodes/links data structure in DB
		var url = 'mongodb://localhost:27017/open-budget-oakland';
		// // Use connect method to connect to the Server
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			db.collection('flow').insertOne(
				{
					"year": doc.year,
					"nodes": nodes, 
					"links": links
				}, 
				function(err, r) {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
				db.close();
			})

		});
	})
}

module.exports = {
	'flow': flow
};