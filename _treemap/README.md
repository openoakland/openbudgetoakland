How To Create a New Budget Treemap Visualization Webpage
========================================================

<a name="createdata"></a>
Creating Treemap Data Files
------------------------------

To create the treemap data files perform the following steps:

1. Save the budget in a commma-seperated-value (CSV) format.
	> File > Save As... > budget.csv
2. Rename/remove column headers
	> Budget type > Rename... > Fiscal Year
	> DEPARTMENT_NAME > Rename... > Department
	> DIVISION_NAME > Rename... > Division
	> ORG_NAME
	> ORG_DESC
	> FUND
	> FUND_NAME > Rename... > Fund Description
	> ACCT_TYPE > Rename... > Account Type
	> ACCT_CAT > Rename... > Account Category
	> ACCT_CODE
	> ACCT_DESCR > Rename... > Account Description
	> AMOUNT > Rename... > Amount
2. Create or edit a configuration file.
	> To view an existing configuration file, open the _src/_treemap/config.json

	> The configuration file controls how the budget data is parsed. It tells the parser the header names, how to group data in the budget, the hierarchy ordering, and the output filenames. Generally, you'll only have to update the years if you're updating an existing configuration file for consistent budget format.

	> See [Appendix: Data Processing Configuration File Details](#dataconfigappendix) for more information about the configuration file.

3. Place the CSV file in the "_treemap" directory.

4. Run the data processing [python](https://www.python.org/) script
	> In the terminal: Change to "_treemap" directory.

		$ python treemap_process_data.py config.json budget.csv

	> If your confused, try the --help option

		$ python treemap_process_data.py --help
		usage: treemap_process_data.py [-h] configuration budget

		Create treemap data files from a budget in CSV format.

		positional arguments:
		  configuration  A configuration file describing how the data should be organized.
		  budget         A CSV formatted budget

		optional arguments:
		  -h, --help     show this help message and exit
5. Move the generated data files to an appropriate place with your source data.

		mkdir ../_src/data/tree/my-budget-directory .. if needed
		mv Final.Revenue.FY18.json ../_src/data/tree/
		mv Final.Revenue.FY18.json ../_src/data/tree/
		mv Final.Expense.FY18.json ../_src/data/tree/
		mv Final.Expense.FY18.json ../_src/data/tree/

6. After running the python script the original CSV version of the budget and config.jason used can be placed in a new directory within _treemap/budgets for reference or future use. This directory includes Grand Rapids, MI and Oakland, CA examples.

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
