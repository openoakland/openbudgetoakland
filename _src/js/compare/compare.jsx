import React from 'react';
import ReactDOM from 'react-dom';
import ControlPanel from './ControlPanel'

class Compare extends React.Component {
	render(){
		return <div className="row">
      <ControlPanel></ControlPanel>
      <Chart></Chart>
    </div>
	}
}

class Chart extends React.Component {
  render(){
    return <div className="col-sm-9"><h2>chart area</h2></div>
  }
}

ReactDOM.render(
  <Compare/>,
  document.getElementById('root')
);