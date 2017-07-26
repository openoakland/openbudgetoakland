import axios from 'axios';
import {descending} from 'd3-array';


const API_BASE = 'https://live-open-budget-oakland-administration.pantheonsite.io' +
  '/wp-json/obo/v1';
// const API_BASE = '/data/compare';

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
    // return API_BASE + typePaths[type] + dimensionPaths[dimension] + `/${year}.json`;
    return API_BASE + typePaths[type] + dimensionPaths[dimension] + '/' + year;
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
  // return axios.get(API_BASE + typePaths.spending + '/totals.json')
  return axios.get(API_BASE + typePaths.spending)
  .then(response => {
    const data = response.data;
    data.sort((a,b) => {
      // sort in reverse chronological order, 
      // then adjusted,adopted,proposed within each year
      const [indexA, indexB] = [a,b].map(record => {
        const year = record.fiscal_year_range.slice(2,4);
        // type numbers don't really correspond to the order we want;
        // this rearranges them
        const type = 6 / record.budget_type;
        // construct numbers that will sort in descending order;
        // 2 digit year before the decimal, transformed type number after
        return +`${year}.${type}`;
      });
      return d3.descending(indexA, indexB);
    });
    return data;
  });
}