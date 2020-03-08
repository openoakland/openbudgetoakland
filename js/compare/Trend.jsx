import React from 'react';
import {Bar} from 'react-chartjs-2';
import {keys, set} from 'd3-collection';

import {asTick} from './utils.jsx';

const chartOpts = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      ticks: {
        autoSkip: false,
      },
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Amount (in millions)'
      },
      ticks: {
        beginAtZero: true,
        callback: value => {
          // display as currency in millions
          const num = (value / 1000000).toLocaleString('en');
          return `\$${num}M`;
        },
      },
    }],
  },
  tooltips: {
    callbacks: {
      label: (item, data) => {
        // display as currency in millions
        const label = data.datasets[item.datasetIndex].label;
        return `${label}: ${asTick(item.yLabel / 1000000)}M`;
      },
    },
  },
};


export default class Trend extends React.Component {

  render () {
    // get list of all possible keys from both budgets
    const allKeys = set();
    keys(this.props.data[0]).forEach(key => {
      allKeys.add(key);
    });
    keys(this.props.data[1]).forEach(key => {
      allKeys.add(key);
    });
    const labels = allKeys.values().sort();
    const datasets = this.props.data.map((record, i) => {
      return {
        label: this.props.years[i].fiscal_year_range,
        data: labels.map(label => record[label]),
        backgroundColor: this.props.colors[i],
      };
    });
    const data = {labels, datasets};

    return <Bar data={data} options={chartOpts} height={125}></Bar>

  }
}