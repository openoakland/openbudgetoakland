const API_BASE = 'dev-open-budget-oakland-administration.pantheonsite.io' +
  '/wp-json/obo/v1/';

export function fetchBreakdownData (years, type, dimension) {
  return new Promise((resolve, reject) => {
    // TODO: replace dummy data and latency with real fetching
    setTimeout(() => {
      if (years && years.every(year => !!year)) {
        if (type === 'spending') {
          if (dimension === 'department') {
            resolve([
              {
                "Police": 242535092,
                "Economic & Workforce Development": 17291413,
                "Planning & Building": 26996545,
                "Public Works": 161487326,
                "Capital Improvement Projects": 32150843,
                "Parks & Recreation": 26120901,
                "City Council": 4491097,
                "City Clerk": 3462575,
                "Finance": 35604483,
                "Fire": 139494304,
                "Race & Equity": 312566,
                "Housing & Community Development": 18770502,
                "City Attorney": 15055588,
                "Human Resources Management": 6570365,
                "City Auditor": 1826542,
                "Human Services": 70108819,
                "Information Technology": 22960093,
                "Public Ethics Commission": 870223,
                "City Administrator": 17801806,
                "Public Library": 30177494,
                "Mayor": 2865779,
                "Non-Departmental": 305203325,
              },
              {
                "Police": 219657802,
                "Planning & Building": 21736668,
                "Public Works": 140569978,
                "Capital Improvement Projects": 29208000,
                "City Council": 3701402,
                "City Clerk": 1923619,
                "Fire": 125194558,
                "Housing & Community Development": 13310251,
                "City Attorney": 13152769,
                "City Auditor": 1510761,
                "Community Services": 85087482,
                "Administrative Services": 49948003,
                "City Administrator": 29423957,
                "Public Library": 27394879,
                "Mayor": 2243560,
                "Non-Departmental": 326058462,
              },
            ]);
          } else if (dimension === 'category') {
            resolve([
              {
                "Travel & Education": 5822002.0,
                "Civilian Overtime": 3999213.0,
                "Internal Services & Work Orders": 70616013.0,
                "Other Expenditures and Disbursments": 15052321.0,
                "Services & Supplies": 70236419.0,
                "Misc. Personnel Adjustments": 15651740.0,
                "Overhead Allocations": 35961608.0,
                "Allowances & Premiums": 13627541.0,
                "Recoveries": -63146131.0,
                "Civilian Fringe Benefits": 66244276.0,
                "Sworn Fringe Benefits": 51731888.0,
                "Civilian Retirement": 60051831.0,
                "Sworn Overtime": 15119069.0,
                "Capital Acquistions": 30553348.0,
                "Civilian Salaries": 181303775.0,
                "Debt Payments": 151807854.0,
                "Sworn Salaries": 140120836.0,
                "Project Offsets & Carryforwards": -7069237.0,
                "Contributions to Fund Balances": 19315613.0,
                "Sworn Retirement": 57757706.0,
                "Operating Transfers": 133614994.0,
                "Contract Services": 113765002.0,
              },
              {
                "Measure Y": 469245.0,
                "Travel & Education": 2953535.0,
                "Civilian Overtime": 3362802.0,
                "Misc. Personnel Adjustments": 3210288.0,
                "Human Resources": 5646064.0,
                "Administration": 8406725.0,
                "Neighborhood Services": 332264.0,
                "Internal Services & Work Orders": 41917418.0,
                "Capital Acquistions": 27984724.0,
                "Treasury": 7210185.0,
                "Parks & Recreation": 24276922.0,
                "Recoveries": -52299451.0,
                "Economic Workforce": 8752428.0,
                "Operating Transfers": 147681736.0,
                "Controller's Office": 5846233.0,
                "Overhead Allocations": 25333441.0,
                "Contract Compliance": 1809984.0,
                "Civilian Fringe Benefits": 42913106.0,
                "Allowances & Premiums": 14136107.0,
                "Contributions to Fund Balances": 9610496.0,
                "Citizens' Police Review Board": 2151998.0,
                "Sworn Fringe Benefits": 48180484.0,
                "Civilian Retirement": 31408093.0,
                "Other Services": 3393757.0,
                "Human Services": 60478296.0,
                "Services & Supplies": 61341475.0,
                "Civilian Salaries": 118716685.0,
                "Debt Payments": 166054089.0,
                "Information Technology": 13332392.0,
                "Sworn Salaries": 120736471.0,
                "Sworn Overtime": 16269330.0,
                "Project Offsets & Carryforwards": -6334370.0,
                "Revenue": 16734621.0,
                "Public Ethics": 308010.0,
                "Sworn Retirement": 43899910.0,
                "Other Expenditures and Disbursments": 11787700.0,
                "Oaklanders' Assistance Center": 206915.0,
                "Neighborhood Investment": 5103403.0,
                "Contract Services": 46798640.0
              },
            ]);
          }
        }
        // TODO: revenue?
      }
    }, 1000);
  });

    // start two concurrent requests, one per year;
    // wait for them both to return before updating state
    // const urls = years.map((year) => {
    //   return API_URL + `account-cats/FY${year}`;
    // })
    // axios.all(urls.map(url => axios.get(url)))
    //   .then(axios.spread((...budgets) => {
    //     // put the data in the thing
    //     // TODO: filter by budget type, API returns records from all
    //     this.setState({budgets: budgets.map((b,i) => b.data.reduce((acc, row) => {
    //       // convert to object and cast totals to numbers
    //       acc[row.account_category] = +row.total;
    //       return acc;
    //       }, {}))
    //   });
    // }));
}

export function fetchTotals () {
  return new Promise((resolve, reject) => {
    // TODO: replace dummy data and latency with real api call
    setTimeout(() => {
      resolve([
        {"budget_type":1, "fiscal_year_range":"FY13-14", "total":1094533634},
        {"budget_type":1, "fiscal_year_range":"FY14-15", "total":1090122151},
        {"budget_type":2, "fiscal_year_range":"FY16-17", "total":1239428331},
      ]);
    }, 1000);
  });
}