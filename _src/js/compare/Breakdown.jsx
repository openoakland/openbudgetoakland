import React from 'react';
import axios from 'axios';
import Spinner from 'react-spinkit';

import DiffTable from './DiffTable.jsx';
import Trend from './Trend.jsx';
import {fetchBreakdownData} from './api.js'
import {BUDGET_TYPES} from './utils.jsx';

export default class SpendingByDept extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      budgets: [],
      pending: true,
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
    this.setState({pending: true})
    // if there aren't valid year objects,
    // the component state will remain pending
    // until another fetch is initiated with valid years
    if (years && years.every(year => !!year)) {
      const yearNames = years.map(year => year.fiscal_year_range);
      const yearTypes = years.map(year => year.budget_type);
      fetchBreakdownData(yearNames, yearTypes, this.props.type, this.props.dimension)
      .then(budgets => {
        this.setState({budgets, pending: false});
      });
    }
  }

  // TODO: special state when there are no differences?
  render () {
    if (this.state.pending) {
      return <Spinner spinnerName="wave"/>
    }
    return <div>
      <Trend data={this.state.budgets} colors={this.props.colors}
        years={this.props.years}/>
      <DiffTable data={this.state.budgets} years={this.props.years}
        colors={this.props.colors} diffColors={this.props.diffColors}
        usePct={this.props.usePct}></DiffTable>
    </div>

  }
}
