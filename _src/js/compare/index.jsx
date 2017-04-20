import React from 'react';
import ReactDOM from 'react-dom';
import {Nav, NavItem, Tab} from 'react-bootstrap';
import Select from 'react-select';
import {schemeSet2 as colors} from 'd3-scale-chromatic';

import Total from './Total.jsx';
import {BUDGET_TYPES} from './utils.jsx';
import Breakdown from './Breakdown.jsx';

const styles = [
  {color: colors[0]},
  {color: colors[1]},
];
const diffColors = {
  neg: '#e41a1c',
  pos: '#4daf4a',
};
// TODO: get this dynamically from the API
const totals = [
  {
    key: '2016-17',
    total: 1202960209,
  },
  {
    key: '2014-15',
    total: 1182157681,
  },
];

function getBudgetOption (record, index) {
  return {
    value: index,
    label: `${record.fiscal_year_range} ${BUDGET_TYPES[record.budget_type]}`,
  };
}
// TODO: get this dynamically from the API
const mockTotals = [
  {"budget_type":"1","fiscal_year_range":"FY13-14","total":"1094533634"},
  {"budget_type":"1","fiscal_year_range":"FY14-15","total":"1090122151"},
  {"budget_type":"2","fiscal_year_range":"FY16-17","total":"1239428331"}
];

const budgetChoices = mockTotals.map(getBudgetOption);
const defaultChoices = [
  budgetChoices[2],
  budgetChoices[1]
];

class Compare extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      changeType: 'pct',
      usePct: true,
      budget1Choice: defaultChoices[0].value,
      budget1: mockTotals[defaultChoices[0].value],
      budget2Choice: defaultChoices[1].value,
      budget2: mockTotals[defaultChoices[1].value],
    };
    this.updateChangeType = this.updateChangeType.bind(this);
    this.selectBudget = this.selectBudget.bind(this);
    this.selectBudget1 = this.selectBudget1.bind(this);
    this.selectBudget2 = this.selectBudget2.bind(this);
  }

  updateChangeType (event) {
    const target = event.target;
    this.setState({
      changeType: target.value,
    });
  }

  selectBudget1 (option) {
    this.selectBudget('budget1', option.value);
  }

  selectBudget2 (option) {
    this.selectBudget('budget2', option.value);
  }

  selectBudget (key, index) {
    this.setState({
      [`${key}Choice`]: index,
      [key]: mockTotals[index],
    });
  }

  render() {
    const usePct = this.state.changeType === 'pct';
    const selectedYears = [this.state.budget1, this.state.budget2];

    return <div>
      <div className="row">
        <div className="col-sm-10">
          <h1>Compare <span style={styles[0]} className="choose-budget">
            <Select options={budgetChoices} value={this.state.budget1Choice}
              onChange={this.selectBudget1} searchable={false} clearable={false}/>
            </span> with <span
            style={styles[1]} className="choose-budget"><Select
              options={budgetChoices} value={this.state.budget2Choice}
              onChange={this.selectBudget2} searchable={false}
              clearable={false}/></span>
          </h1>
        </div>
        <div className="col-sm-2">
          <div className="form-group">
            <label>Show changes as:</label>
            <select className="form-control" id="sortControl"
              value={this.state.changeType} onChange={this.updateChangeType}>
              <option value="pct">percentage</option>
              <option value="usd">dollars</option>
            </select>
          </div>
        </div>
        <div className="col-sm-12">
          <Total data={totals} colors={colors} diffColors={diffColors}
            usePct={usePct}></Total>
          <h2>Budget breakdowns</h2>
          <p>Drill down blah tk</p>
        </div>
      </div>
      <Tab.Container id="selectBreakdown" defaultActiveKey="spendDept">
        <div className="row">
          <div className="col-sm-3">
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="spendDept">Spending by Department</NavItem>
                <NavItem eventKey="spendCat">Spending by Category</NavItem>
                <NavItem eventKey="revDept">Revenue by Department</NavItem>
                <NavItem eventKey="revCat">Revenue by Category</NavItem>
                <NavItem eventKey="addRemDept">Departments Added &amp; Removed</NavItem>
              </Nav>
          </div>
          <div className="col-sm-9">
            <Tab.Content mountOnEnter>
              <Tab.Pane eventKey="spendDept">
                <Breakdown colors={colors} diffColors={diffColors}
                  usePct={usePct} years={selectedYears} type="spending"
                  dimension="department"></Breakdown>
              </Tab.Pane>
              <Tab.Pane eventKey="spendCat">
                <Breakdown colors={colors} diffColors={diffColors}
                  usePct={usePct} years={selectedYears} type="spending"
                  dimension="category"></Breakdown>
              </Tab.Pane>
              <Tab.Pane eventKey="revDept">
                rev by dept
              </Tab.Pane>
              <Tab.Pane eventKey="revCat">
                rev by cat
              </Tab.Pane>
              <Tab.Pane eventKey="addRemDept">
                depts added removed
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  }
}

ReactDOM.render(
  <Compare/>,
  document.getElementById('root')
);