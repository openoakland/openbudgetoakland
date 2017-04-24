import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {entries} from 'd3-collection';
import {asTick, asDiff, DiffStyled, compareChartOptions} from './utils';
import Spinner from 'react-spinkit';

export default class Total extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const totals = this.props.data;
    if (!totals.length || totals.some(record => !record)) {
      return <Spinner spinnerName="wave" noFadeIn/>
    }

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
      <HorizontalBar data={data} height={25} options={compareChartOptions}></HorizontalBar>
    </div>
  }
}