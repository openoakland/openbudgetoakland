import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {entries} from 'd3-collection';
import {ascending, descending} from 'd3-array';

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
          // display as currency in millions
          return `${asTick(value / 1000000)}M`;
        },
      },
    }]
  }
};

export default class DiffTable extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      sortBy: 'diff',
    }
    this.updateSort = this.updateSort.bind(this);
  }

  updateSort (event) {
    const target = event.target;
    this.setState({sortBy: target.value});
  }

  render () {
    const sortFunc = this.state.sortBy === 'diff' ? descending : ascending;

    const diffList = entries(this.props.data[0]).map(entry => {
      const res = Object.assign({}, entry);
      // if dept exists in both, and values are positive, return diff
      res.prev = this.props.data[1][entry.key];
      if (res.prev) {
        res.diff = entry.value - res.prev;
        if (this.props.usePct) {
          res.diff = res.diff / Math.abs(res.prev);
        }
      } else {
        res.diff = null;
      }
      return res;
    }).filter(entry => entry.diff !== null)
    .sort((a, b) => {
      return sortFunc(a[this.state.sortBy], b[this.state.sortBy]);
    })
    .map(entry => {
      const data = {
        labels: [''],
        datasets: [
          {
            data: [entry.value],
            label: entry.key,
            backgroundColor: this.props.colors[0],
          },
          {
            data: [entry.prev],
            label: entry.key,
            backgroundColor: this.props.colors[1],
          },
        ]
      };

      return <tr key={entry.key}>
        <td>
          <h4>
            {entry.key}
            <HorizontalBar data={data} options={chartOptions} height={40}>
            </HorizontalBar>
          </h4>
        </td>
        <td>
          <DiffStyled diff={entry.diff} colors={this.props.diffColors}
            usePct={this.props.usePct}>
          </DiffStyled>
        </td>
      </tr>
    });

    return <table className="table">
      <thead>
        <tr>
          <th colSpan="2" className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 col-sm-offset-6 control-label" htmlFor="sortControl">sort by: </label>
              <div className="col-sm-3">
                <select className="form-control" id="sortControl"
                value={this.state.sortBy} onChange={this.updateSort}>
                  <option value="diff">amount</option>
                  <option value="key">name</option>
                </select>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {diffList}
      </tbody>
    </table>
  }
}