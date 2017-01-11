import React from 'react';
import ReactDOM from 'react-dom';
import ControlPanel from './ControlPanel'
import Chart from './Chart'

class Compare extends React.Component {
  constructor(props) {
    super(props);
    this.accountTypes = ['Spending', 'Revenue'];
    this.setAccountType = this.setAccountType.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.setGeneralFundOnly = this.setGeneralFundOnly.bind(this);

    this.state = {
      activeAccountType: 0,
      filter: 'total',
      generalFundOnly: false
    };
  }

  setAccountType(newType) {
    this.setState({activeAccountType: this.accountTypes.indexOf(newType)});
  }

  setFilter(newFilter){
    this.setState({filter: newFilter});
  }

  setGeneralFundOnly(bool){
    this.setState({generalFundOnly: bool})
  }

	render(){
		return <div className="row">
      <ControlPanel accountTypes={this.accountTypes} 
        setAccountType={this.setAccountType} 
        activeAccountType={this.state.activeAccountType}
        filter={this.state.filter} setFilter={this.setFilter}
        generalFundOnly={this.state.generalFundOnly}
        setGeneralFundOnly={this.setGeneralFundOnly}></ControlPanel>
      <Chart filter={this.state.filter}></Chart>
    </div>
	}
}

ReactDOM.render(
  <Compare/>,
  document.getElementById('root')
);