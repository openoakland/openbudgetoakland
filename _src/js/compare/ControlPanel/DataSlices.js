import React from 'react';
import {Collapse, FormControl, ListGroup, ListGroupItem, Panel} 
  from 'react-bootstrap';
import ActiveViewLink from './ActiveViewLink';

const detailLevels = {
  Spending: ['Department', 'Division', 'Org', 'Account'],
  Revenue: ['Category', 'Account']
};

class DataSlices extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      accountType: 'Spending',
      activeView: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.nestList = this.nestList.bind(this);
    this.detailLevelClick = this.detailLevelClick.bind(this);
    this.activeViewClick = this.activeViewClick.bind(this);
  }

  handleChange(event){
    this.setState({accountType: event.target.value});
  }

  detailLevelClick(detailLevel){
    debugger;
    this.setState({detailLevel})
  }

  activeViewClick(activeView){
    this.setState({
      activeView: activeView,
      detailLevel: detailLevels[this.state.accountType][0]
    })
  }

  nestList(array, index){
    // recursively nest array items in list elements
    if (index < array.length){
      return <ListGroup>
        <ListGroupItem active={this.state.detailLevel === array[index]}
        onClick={this.detailLevelClick}>
          {array[index]}
        </ListGroupItem>
        {this.nestList(array, index + 1)}
      </ListGroup>
    }
  }

  render(){
    const accountTypes = ['Spending', 'Revenue'];
    const options = accountTypes.map(accountType => 
     <option key={accountType} value={accountType}>{accountType}</option> 
    )


    const title = <h3>Levels of Data</h3>

    return <Panel header={title}>
      <FormControl componentClass="select" 
      value={this.state.accountType} 
      onChange={this.handleChange}>
        {options}
      </FormControl>

      <ListGroup fill>

        <ActiveViewLink active={this.state.activeView === 'total'} 
        updateView={this.activeViewClick} viewName="total">
          Total {this.state.accountType}
        </ActiveViewLink>

        <ListGroupItem disabled={true}>
          {this.state.accountType} grouped by:
        </ListGroupItem>
        
        <ActiveViewLink active={this.state.activeView === 'dataGroups'}
        updateView={this.activeViewClick} viewName="dataGroups">
          {detailLevels[this.state.accountType][0]}
          <Collapse in={this.state.activeView === 'dataGroups'}>
            {this.nestList(detailLevels[this.state.accountType], 0)}
          </Collapse>
        </ActiveViewLink>
        <ActiveViewLink active={this.state.activeView === 'accounts'}
        updateView={this.activeViewClick} viewName="accounts">
          Line Item
          <Collapse in={this.state.activeView === 'accounts'}>
            {this.nestList(detailLevels[this.state.accountType], 0)}
          </Collapse>
        </ActiveViewLink>
      </ListGroup>
    </Panel>
  }
}

module.exports = DataSlices;
