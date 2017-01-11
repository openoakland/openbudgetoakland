import React from 'react';
import axios from 'axios';

class Chart extends React.Component {
  constructor(props){
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {
      budgetData: []
    }
  }

  fetchData(filter){
    // filter determines what endpoint we request from
    var url = `/data/compare/${filter}.json`;
    axios.get(url).then(response => {
      this.setState({budgetData: response.data.data});
    });
  }

  componentDidMount() {
    // initial data fetch
    this.fetchData(this.props.filter);
  }

  render(){
    const records = this.state.budgetData.map(record => {
        return <p key={record.fy}>{record.fy} - {record.amount}</p>
      }
    );

    return <div className="col-sm-9">
      <h2>chart area</h2>
      {records}
    </div>
  }
}

module.exports = Chart;