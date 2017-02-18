import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {entries} from 'd3-collection';
import {format} from 'd3-format';

const asTick = format('$,.1f');
const asDollars = format('+$,');
const asPct = format('+.2%');

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
}

export default class Total extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const totals = this.props.data;
    let diff = totals[0].total - totals[1].total;
    let asDiff = asDollars;
    if (this.props.usePct) {
      diff = diff / totals[1].total;
      asDiff = asPct;
    }
    const diffStyle = {
      color: diff >= 0 ? this.props.diffColors.pos : this.props.diffColors.neg,
    };
    const data = {
      labels: ['Total'],
      datasets: totals.map((entry, i) => {
        return {
          data: [entry.total],
          label: entry.key,
          backgroundColor: this.props.colors[i],
        };
      }).reverse()
    };

    return <div>
      <h3>Total Change: <span style={diffStyle}>{asDiff(diff)}</span></h3>
      <HorizontalBar data={data} height={25} options={chartOptions}></HorizontalBar>
    </div>
  }
}