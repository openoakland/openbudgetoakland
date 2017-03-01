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
  }

  render() {
    const onlyIn0 = entries(this.props.data[0][this.props.diffKey]).map(entry => {
      let res = null;
      const prev = this.props.data[1][this.props.diffKey][entry.key];
      // collect entries whose key doesn't appear in 1
      if (typeof prev === 'undefined') {
        res = entry;
      }
      return res;
    })
    .filter(entry => entry !== null)
    ;

    const onlyIn1 = entries(this.props.data[1][this.props.diffKey]).map(entry => {
      let res = null;
      const prev = this.props.data[0][this.props.diffKey][entry.key];
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
          label: `Only in ${this.props.data[0].key}`,
          backgroundColor: this.props.colors[0],
        },
        {
          data: onlyIn0.map(entry => 0).concat(onlyIn1.map(entry => entry.value)),
          label: `Only in ${this.props.data[1].key}`,
          backgroundColor: this.props.colors[1],
        },
      ]
    };

    return <div>
      <HorizontalBar data={data} options={chartOptions}></HorizontalBar>
    </div>
  }
}