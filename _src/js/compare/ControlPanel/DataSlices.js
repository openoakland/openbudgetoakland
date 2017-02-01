import React from 'react';
import {Checkbox, FormControl, ListGroup, ListGroupItem, Panel}
  from 'react-bootstrap';
import ActiveViewLink from './ActiveViewLink';


class DataSlices extends React.Component {
  constructor(props){
    super(props);
    this.setAccountType = this.setAccountType.bind(this);
    this.setGeneralFundOnly = this.setGeneralFundOnly.bind(this);
  }

  setAccountType(event){
    this.props.setAccountType(event.target.value);
  }

  setGeneralFundOnly(event){
    this.props.setGeneralFundOnly(event.target.checked);
  }

  render(){
    const options = this.props.accountTypes.map(accountType =>
     <option key={accountType} value={accountType}>{accountType}</option>
    )

    const currentAccountType = this.props.accountTypes[this.props.activeAccountType];

    const title = <h3>Filters</h3>

    return <Panel header={title}>
      <FormControl componentClass="select"
      value={currentAccountType}
      onChange={this.setAccountType}>
        {options}
      </FormControl>

      <Checkbox checked={this.props.generalFundOnly}
        onChange={this.setGeneralFundOnly} disabled>
        General Fund only
      </Checkbox>

      <ListGroup fill>

        <ActiveViewLink active={this.props.filter === 'total'} 
        updateView={this.props.setFilter} viewName="total">
          Total {currentAccountType}
        </ActiveViewLink>

        <ListGroupItem bsStyle="info">
          {currentAccountType} grouped by:
        </ListGroupItem>
        
        <ActiveViewLink active={this.props.filter === 'department'}
        updateView={this.props.setFilter} viewName="department">
          Department
        </ActiveViewLink>

        <ActiveViewLink active={this.props.filter === 'accountCategory'}
        updateView={this.props.setFilter} viewName="accountCategory">
          {currentAccountType} Category
        </ActiveViewLink>
        
      </ListGroup>
    </Panel>
  }
}

module.exports = DataSlices;
