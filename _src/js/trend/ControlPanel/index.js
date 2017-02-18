import React from 'react';
import Legend from './legend';
import ComparisonRange from './comparisonRange';
import DataSlices from './DataSlices';

class ControlPanel extends React.Component {
  render(){
    return <div className="col-sm-3">
      <Legend></Legend>
      <ComparisonRange></ComparisonRange>
      <DataSlices accountTypes={this.props.accountTypes}
        setAccountType={this.props.setAccountType}
        activeAccountType={this.props.activeAccountType}
        filter={this.props.filter} setFilter={this.props.setFilter}
        generalFundOnly={this.props.generalFundOnly}
        setGeneralFundOnly={this.props.setGeneralFundOnly}></DataSlices>
    </div>
  }
}

module.exports = ControlPanel;