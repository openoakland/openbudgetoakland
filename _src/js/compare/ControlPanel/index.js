import React from 'react';
import Legend from './legend';
import ComparisonRange from './comparisonRange';
import DataSlices from './DataSlices';

class ControlPanel extends React.Component {
  render(){
    return <div className="col-sm-3">
      <Legend></Legend>
      <ComparisonRange></ComparisonRange>
      <DataSlices></DataSlices>
    </div>
  }	
}

module.exports = ControlPanel;