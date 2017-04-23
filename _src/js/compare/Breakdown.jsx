import React from 'react';
import axios from 'axios';

import DiffTable from './DiffTable.jsx';
import {fetchBreakdownData} from './api.js'
import {BUDGET_TYPES} from './utils.jsx';

export default class SpendingByDept extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      budgets: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount () {
    this.fetchData(this.props.years);
  }

  componentWillReceiveProps(nextProps) {
    // TODO: do a better comparison;
    // this works by reference and fires every time
    if (this.props.years !== nextProps.years) {
      this.fetchData(nextProps.years);
    }
  }

  fetchData (years) {
    const budgets = fetchBreakdownData(years, this.props.type,
      this.props.dimension);
    this.setState({budgets});
  }

  // TODO: special state when there are no differences?
  render () {
    return <div>
      <DiffTable data={this.state.budgets} years={this.props.years}
        colors={this.props.colors} diffColors={this.props.diffColors}
        usePct={this.props.usePct}></DiffTable>
    </div>

  }
}
