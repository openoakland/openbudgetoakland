import React from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';

class Chart extends React.Component {
  constructor(props){
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.state = {
      data: {},
      deltas: {}
    }
  }

  fetchData(filter){
    // filter determines what endpoint we request from
    const url = `/data/compare/${filter}.json`;
    // TODO: not this
    const colors = {
      '13-14': '#1b9e77',
      '14-15': '#d95f02',
      '15-16': '#7570b3',
      '16-17': '#e7298a'
    }
    axios.get(url).then(response => {
      const data = response.data.data;
      // we expect all years to have the same labels so just pick one
      const labels = Object.keys(data[Object.keys(data)[0]]).sort();
      // build dataset objects to Chart.js specs
      const datasets = Object.keys(data).sort().map(fy => {
        return {
          label: fy,
          data: labels.map(label => {
            return data[fy][label];
          }),
          backgroundColor: colors[fy]
        };
      });
      // compute year-over-year percentage changes within each label
      const deltas = datasets.map((stream, i) => {
        const res = {
          label: stream.label,
          backgroundColor: colors[stream.label]
        };
        // others are compared to the first stream, so first is always 0
        if (i == 0) {
          res.data = stream.data.map(() => {
            return 0
          });
        } else {
          let prev = datasets[i - 1].data;
          res.data = stream.data.map((record, ii) => {
            // get diff over previous stream as a percentage
            return ((record - prev[ii]) / prev[ii]) * 100;
          });
        }
        return res;
      });
      this.setState({data: {labels, datasets}, deltas: {labels, datasets: deltas}});
    });
  }

  componentDidMount() {
    // initial data fetch
    this.fetchData(this.props.filter);
  }

  componentWillReceiveProps(nextProps){
    // if filter prop changed, fetch new data
    if (nextProps.filter !== this.props.filter) {
      this.fetchData(nextProps.filter);
    }
  }

  render(){
    const chartOpts = {
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
          }
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
            }
          }
        }]
      }
    };

    const deltaChartOpts = {
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          }
        }],
        yAxes: [{
          ticks: {
            callback: value => {
              // display as percentage
              return `${value.toFixed(0)}%`;
            }
          }
        }]
      }
    }

    return <div className="col-sm-9">
      <h3>Amounts</h3>
      <Bar data={this.state.data} options={chartOpts} height={200}></Bar>

      <h3>Change year-over-year</h3>
      <Bar data={this.state.deltas} options={deltaChartOpts} height={200}></Bar>
    </div>
  }
}

module.exports = Chart;