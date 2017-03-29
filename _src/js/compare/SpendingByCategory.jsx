import React from 'react';
import axios from 'axios';

import DiffTable from './DiffTable.jsx';
import AddRemove from './AddRemove.jsx';
import {API_URL} from './utils.jsx';

// TODO: dynamically choose via props
const YEARS = ['14-15', '13-14'];

export default class SpendingByCategory extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      budgets: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount () {
    // TODO: dynamically choose via props
    this.fetchData(YEARS);
  }

  fetchData (years) {
    // start two concurrent requests, one per year;
    // wait for them both to return before updating state
    const urls = years.map((year) => {
      return API_URL + `account-cats/FY${year}`;
    })
    axios.all(urls.map(url => axios.get(url)))
      .then(axios.spread((...budgets) => {
        // put the data in the thing
        // TODO: filter by budget type, API returns records from all
        this.setState({budgets: budgets.map((b,i) => b.data.reduce((acc, row) => {
          // convert to object and cast totals to numbers
          acc[row.account_category] = +row.total;
          return acc;
          }, {}))
      });
    }));
  }

  render () {
    return <div>
      <h3>Spending by Category</h3>
      <DiffTable data={this.state.budgets}
        colors={this.props.colors} diffColors={this.props.diffColors}
        usePct={this.props.usePct}></DiffTable>
    </div>
  }
}
