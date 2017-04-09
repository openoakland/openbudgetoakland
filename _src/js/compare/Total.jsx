import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {entries} from 'd3-collection';
import {asTick, asDiff, DiffStyled} from './utils';

const chartOptions = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      ticks: {
        beginAtZero: true,
        callback: value => {
          // display as currency in billions
          return `${asTick(value / 1000000000)}B`;
        },
      },
    }]
  }
};

export default class Total extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const totals = this.props.data;
    let diff = totals[0].total - totals[1].total;
    if (this.props.usePct) {
      diff = diff / totals[1].total;
    }
    const data = {
      labels: ['Total'],
      datasets: totals.map((entry, i) => {
        return {
          data: [entry.total],
          label: entry.key,
          backgroundColor: this.props.colors[i],
        };
      }),
    };

    return <div>
      <h2>Total Change:
        <DiffStyled diff={diff} colors={this.props.diffColors} usePct={this.props.usePct}>
        </DiffStyled>
      </h2>
      <HorizontalBar data={data} height={25} options={chartOptions}></HorizontalBar>
    </div>
  }
}