import React from 'react';
import {entries} from 'd3-collection';
import {HorizontalBar} from 'react-chartjs-2';

import {asTick} from './utils';

const chartOptions = {
  legend: {
    display: true,
  },
  scales: {
    xAxes: [{
      ticks: {
        beginAtZero: true,
        callback: value => {
          // display as currency in millions
          return `${asTick(value / 1000000)}M`;
        },
      },
    }]
  }
};

export default class AddRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
    this.processData = this.processData.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  processData (budgets) {
    if (!budgets || budgets.length === 0) return;

    const onlyIn0 = entries(budgets[0]).map(entry => {
      let res = null;
      const prev = budgets[1][entry.key];
      // collect entries whose key doesn't appear in 1
      if (typeof prev === 'undefined') {
        res = entry;
      }
      return res;
    })
    .filter(entry => entry !== null)
    ;

    const onlyIn1 = entries(budgets[1]).map(entry => {
      let res = null;
      const prev = budgets[0][entry.key];
      // collect entries whose key doesn't appear in 0
      if (typeof prev === 'undefined') {
        res = entry;
      }
      return res;
    })
    .filter(entry => entry !== null)
    ;

    const data = {
      labels: onlyIn0.map(entry => entry.key).concat(onlyIn1.map(entry => entry.key)),
      datasets: [
        {
          // datasets need to be the same length; pad with zeroes
          data: onlyIn0.map(entry => entry.value).concat(onlyIn1.map(entry => 0)),
          label: `Only in ${this.props.years[0]}`,
          backgroundColor: this.props.colors[0],
        },
        {
          data: onlyIn0.map(entry => 0).concat(onlyIn1.map(entry => entry.value)),
          label: `Only in ${this.props.years[1]}`,
          backgroundColor: this.props.colors[1],
        },
      ]
    };

    this.setState({data});
  }

  componentDidMount() {
    this.processData(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    // check for changes first
    const budgets = this.props.data;
    const nextBudgets = nextProps.data;
    if (budgets[0] !== nextBudgets[0] &&
        budgets[1] !== nextBudgets[1]) {
      this.processData(nextBudgets);
    }
  }

  render() {
    return <div>
      <HorizontalBar data={this.state.data} options={chartOptions}></HorizontalBar>
    </div>
  }
}