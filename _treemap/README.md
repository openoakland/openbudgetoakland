How To Create a New Budget Treemap Visualization Webpage
========================================================

Creating a new treemap visualization webpage from a budget spreadsheet can be done in 3 steps.

* [Step 1:](#createdata) Create treemap data files from the budget spreadsheet.
* [Step 2:](#createjade) Create a new [jade](http://jade-lang.com/) page for the treemap.
* [Step 3:](#createlinks) Add links to the new treemap on the website.

<a name="createdata"></a>
Creating Treemap Data Files
------------------------------

To create the treemap data files perform the following steps:

1. Save the budget in a commma-seperated-value (CSV) format.
	> File > Save As...
2. Create or edit a configuration file.
	> To view an existing configuration file, open the config.json

	> The configuration file controls how the budget data is parsed. It tells the parser the header names, how to group data in the budget, the hierarchy ordering, and the output filenames. Generally, you'll only have to update the years if you're updating an existing configuration file for consitent budget format.

	> See [Appendix: Data Processing Configuration File Details](#dataconfigappendix) for more information about the configuration file.

3. Run the data processing [python](https://www.python.org/) script
	> In the terminal:

		$ python treemap_process_data.py config.json budget.csv

	> If your confused, try the --help option

		$ python treemap_process_data.py --help
		usage: treemap_process_data.py [-h] configuration budget

		Create treemap data files from a budget in CSV format.

		positional arguments:
		  configuration  A configuration file describing how the data should be
						 organized.
		  budget         A CSV formatted budget

		optional arguments:
		  -h, --help     show this help message and exit
4. Move the generated data files to an appropriate place with your source data.

		mkdir ../_src/data/my-budget-directory
		mv Revenue.FY13-14.json ../_src/data/my-budget-directory/
		mv Revenue.FY14-15.json ../_src/data/my-budget-directory/
		mv Expense.FY13-14.json ../_src/data/my-budget-directory/
		mv Expense.FY14-15.json ../_src/data/my-budget-directory/

5. Add that stuff to git

		git add ../_src/data/my-budget-directory/*

<a name="createjade"></a>
Creating a Jade Template Page
-----------------------------
The jade template page will soon turn into your budget webpage!

1. Make a copy of the treemap-template.jade file with your new filename.
	> git cp treemap-template.jade my-new-budget.jade
2. Open your new file and update some text.
	* Scroll down until you see the "BUDGET_TITLE" text and insert whatever title you deem appropriate.

			h1 BUDGET_TITLE

	* Update the disqus_identifier info

			/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
			var disqus_shortname = 'openbudgetoakland'; // required: replace example with your forum shortname
			var disqus_identifier = "YOUR_BUDGET_HERE";
			/* * * DON'T EDIT BELOW THIS LINE * * */

	* Towards the bottom you'll also see a javascript section with a configuration that needs updating. It should look a little something like this:

			var config = {
			  /* set values available in dropdown files */
			  dropdown_values: {
				"Year": ["FY13-14", "FY14-15"],
				"Account": ["Revenue", "Expense"]
			  },
			  /* set the default values */
			  dropdown_choice: {
				"Year": "FY14-15",
				"Account": "Expense"
			  },
			  /* create the url to the data file based on the dropdown choices */
			  url: function() {
				return 'data/YOUR_FOLDER_HERE/' + this.dropdown_choice["Account"] + "." + this.dropdown_choice["Year"] + ".json";
			  }
			};

		This configuration does three things
		* Controls what values are available from the dropdown lists.
		* Sets the default values.
		* Creates the url that points to the treemap data files based upon the dropdown choices.

		You will probably only need to update the years from the dropdown choices and make sure that the urls generated match where you put the treemap data files [created during this step](#createdata)

3. Move your jade file next to all the other jade files in the \_src directory.

		git mv my-new-budget.jade ../_src/

If you have Harp installed, you can now preview your budget treemap webpage at http://localhost:9000/my-new-budget.html

	$ cd ../_src/
	$ harp server ./
	------------
	Harp v0.12.1 – Chloi Inc. 2012–2014
	Your server is listening at http://localhost:9000/
	Press Ctl+C to stop the server
	------------

<a name="createlinks"></a>
Linking The New Treemap
-----------------------

To add the links to your budget open up the \_layout.jade file. Look for the section where the budget visualizations are defined, and add in yours

				li.dropdown
                  a.dropdown-toggle(href='#', data-toggle='dropdown')
                    | Oakland's Budget
                    b.caret
                  ul.dropdown-menu
                    li
                      a(href='2013-2015-adopted-budget-treemap.html') 2013-15 Adopted Budget
                    li
                      a(href='2013-2015-mayor-proposed-treemap.html') 2013-15 Mayor's Proposed Spending
                    li
                      a(href='2012-2013-sankey.html') 2012-13 Adopted Revenues &amp; Spending (Flow)
                    li
                      a(href='2011-2013-adopted-budget.html') 2011-13 Adopted Spending
                    li
                      a(href='budget-process.html') Overview of Oakland's Budget Process
                    li
                      a(href='mybudget.html') My new budget

Congratulations! You're Done. Check that stuff into git and call it a day!

-------------------------------------------------
Appendix
=============


<a name="dataconfigappendix"></a>
### Appendix A: Data Processing Configuration File Details
The configuration file controls how the budget data is parsed. It tells the
parser the header names, how to group data in the budget, the hierarchy
ordering, and the output filenames. Generally, you'll only have to update the
years if you're updating an existing configuration file for consitent budget format.

Example:

	{
		"amount_header": "Amount",
		"account_type_header": "Account Type",
		"account_types": {
			"revenue": "Revenue",
			"expense": "Expense"
		},
		"grouping_headers": ["Account Type", "Budget Year Name"],
		"groups": [
			{
				"values": ["Revenue", "FY13-14"],
				"hierarchy":["Budget Year Name", "Fund Description", "Account Category", "Account  Description"],
				"filename": "Revenue.FY13-14.json"
			},
			{
				"values": ["Revenue", "FY14-15"],
				"hierarchy":["Budget Year Name", "Fund Description", "Account Category", "Account  Description"],
				"filename": "Revenue.FY14-15.json"
			},
			{
				"values": ["Expense", "FY13-14"],
				"hierarchy":[
					"Budget Year Name",
					"Fund Description",
					"Department",
					"Division",
					"Account Category",
					"Account  Description"
				],
				"filename": "Expense.FY13-14.json"
			},
			{
				"values": ["Expense", "FY14-15"],
				"hierarchy":[
					"Budget Year Name",
					"Fund Description",
					"Department",
					"Division",
					"Account Category",
					"Account  Description"
				],
				"filename": "Expense.FY14-15.json"
			}
		]
	}

Description of fields:

* amount\_header
	> The column header which contains the budget numerical amounts.
* amount\_type\_header
	> The column header which denotes whether the amount is a revenue or expense.
* account\_types
	> The column headers of the different accounts types (only "revenue" and "expense" are supported).

		"account_types": {
			"expense": expense_column_header,
			"revenue": revenue_column_header
		}
* grouping\_headers
	> A list of one or more column headers used to group the budgets into different treemap views.
	> On the treemap webpage, different "groups" show up as different dropdown menu options.

		"grouping_headers": [column_header, ...]

* groups
	> A list of one or more group configurations.
	> On the treemap webpage, different "groups" show up as different dropdown menu options.

		"groups" : {
			"values": [value, ...],
			"hierarcy": [column_header, ...],
			"filename": group_filename
		}

	> * values
	>	> A list of values that describe this group.  These must conincide with the values found in the grouping\_headers.

	> * hierarchy
	> 	> A list of column headers that control the order in which budget items are summarized.

	> * filename
	>	> The output filename for that group.
