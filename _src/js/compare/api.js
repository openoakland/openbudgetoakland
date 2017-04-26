import axios from 'axios';

const API_BASE = 'https://dev-open-budget-oakland-administration.pantheonsite.io' +
  '/wp-json/obo/v1';

const typePaths = {
  spending: '/fiscal-years-expenses',
  revenue: '/fiscal-years-revenue',
};

const dimensionPaths = {
  department: '/depts',
  category: '/account-cats',
};

const dimensionKeys = {
  department: 'department',
  category: 'account_category',
};

export function fetchBreakdownData (years, yearTypes, type, dimension) {
  // start two concurrent requests, one per year;
  // wait for them both to return before ending the fetch
  const urls = years.map((year) => {
    return API_BASE + typePaths[type] + dimensionPaths[dimension] + `/${year}`;
  });
  return axios.all(urls.map(url => axios.get(url)))
    .then(axios.spread((...budgets) => {
      // put the data in the thing
      // TODO: filter by budget type, API returns records from all
      return budgets.map((b,i) => b.data.reduce((acc, row) => {
        // filter rows that don't match the desired budget type;
        // double-equals because it might be an integer in string form
        if (row.budget_type == yearTypes[i]) {
          // convert to object and cast totals to numbers
          acc[row[dimensionKeys[dimension]]] = +row.total;
        }
        return acc;
      }, {}));
    }));
}

export function fetchTotals () {
  return axios.get(API_BASE + typePaths.spending)
  .then(response => response.data);
}