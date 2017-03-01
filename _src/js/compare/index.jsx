import React from 'react';
import ReactDOM from 'react-dom';
import {schemeSet2 as colors} from 'd3-scale-chromatic';

import Total from './Total.jsx';
import DiffTable from './DiffTable.jsx';
import AddRemove from './AddRemove.jsx';

const styles = [
  {color: colors[0]},
  {color: colors[1]},
];
const diffColors = {
  neg: '#e41a1c',
  pos: '#4daf4a',
};
const budgets = [
  {
    key: '2016-17',
    total: 1202960209,
    depts: {
      "Police": 242535092,
      "Economic & Workforce Development": 17291413,
      "Planning & Building": 26996545,
      "Public Works": 161487326,
      "Capital Improvement Projects": 32150843,
      "Parks & Recreation": 26120901,
      "City Council": 4491097,
      "City Clerk": 3462575,
      "Finance": 35604483,
      "Fire": 139494304,
      "Race & Equity": 312566,
      "Housing & Community Development": 18770502,
      "City Attorney": 15055588,
      "Human Resources Management": 6570365,
      "City Auditor": 1826542,
      "Human Services": 70108819,
      "Information Technology": 22960093,
      "Public Ethics Commission": 870223,
      "City Administrator": 17801806,
      "Public Library": 30177494,
      "Mayor": 2865779,
      "Non-Departmental": 305203325,
    },
    categories: {
      "Travel & Education": 5822002.0,
      "Civilian Overtime": 3999213.0,
      "Internal Services & Work Orders": 70616013.0,
      "Other Expenditures and Disbursments": 15052321.0,
      "Services & Supplies": 70236419.0,
      "Misc. Personnel Adjustments": 15651740.0,
      "Overhead Allocations": 35961608.0,
      "Allowances & Premiums": 13627541.0,
      "Recoveries": -63146131.0,
      "Civilian Fringe Benefits": 66244276.0,
      "Sworn Fringe Benefits": 51731888.0,
      "Civilian Retirement": 60051831.0,
      "Sworn Overtime": 15119069.0,
      "Capital Acquistions": 30553348.0,
      "Civilian Salaries": 181303775.0,
      "Debt Payments": 151807854.0,
      "Sworn  Salaries": 140120836.0,
      "Project Offsets & Carryforwards": -7069237.0,
      "Contributions to Fund Balances": 19315613.0,
      "Sworn Retirement": 57757706.0,
      "Operating Transfers": 133614994.0,
      "Contract Services": 113765002.0,
    },
  },
  {
    key: '2014-15',
    total: 1182157681,
    depts: {
      "Police": 219657802,
      "Planning & Building": 21736668,
      "Public Works": 140569978,
      "Capital Improvement Projects": 29208000,
      "City Council": 3701402,
      "City Clerk": 1923619,
      "Fire": 125194558,
      "Housing & Community Development": 13310251,
      "City Attorney": 13152769,
      "City Auditor": 1510761,
      "Community Services": 85087482,
      "Administrative Services": 49948003,
      "City Administrator": 29423957,
      "Public Library": 27394879,
      "Mayor": 2243560,
      "Non-Departmental": 326058462
    },
    categories: {
      "Measure Y": 469245.0,
      "Travel & Education ": 2953535.0,
      "Civilian Overtime": 3362802.0,
      " Misc. Personnel Adjustments": 3210288.0,
      "Human Resources": 5646064.0,
      "Administration": 8406725.0,
      "Neighborhood Services": 332264.0,
      "Internal Services & Work Orders": 41917418.0,
      "Capital Acquistions": 27984724.0,
      "Treasury": 7210185.0,
      "Parks & Recreation": 24276922.0,
      "Recoveries": -52299451.0,
      "Economic Workforce": 8752428.0,
      "Operating Transfers": 147681736.0,
      "Controller'S Office": 5846233.0,
      "Overhead Allocations": 25333441.0,
      "Contract Compliance": 1809984.0,
      "Civilian Fringe Benefits": 42913106.0,
      " Allowances & Premiums": 14136107.0,
      "Contributions To Fund Balances": 9610496.0,
      "Citizens' Police Review Board": 2151998.0,
      "Sworn Fringe Benefits": 48180484.0,
      "Civilian Retirement": 31408093.0,
      "Other Services": 3393757.0,
      "Human Services": 60478296.0,
      "Services & Supplies": 61341475.0,
      "Civilian Salaries": 118716685.0,
      "Debt Payments": 166054089.0,
      "Information Technology": 13332392.0,
      "Sworn  Salaries": 120736471.0,
      "Sworn Overtime": 16269330.0,
      "Project Offsets & Carryforwards": -6334370.0,
      "Revenue": 16734621.0,
      "Public Ethics": 308010.0,
      "Sworn Retirement": 43899910.0,
      "Other Expenditures And Disbursments": 11787700.0,
      "Oaklanders' Assistance Center": 206915.0,
      "Neighborhood Investment ": 5103403.0,
      "Contract Services": 46798640.0
    },
  },
];

class Compare extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      usePct: true
    };

    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  handleRadioChange (event) {
    const target = event.target;
    this.setState({
      usePct: target.value === 'pct'
    });
  }

  render() {
    return <div className="row">
      <div className="col-sm-12">
        <h2>Compare <strong style={styles[0]}>{budgets[0].key}</strong> with <strong style={styles[1]}>{budgets[1].key}</strong></h2>
        <div>
          show change as: <label>
            <input
              name="usePct"
              type="radio"
              value="usd"
              checked={!this.state.usePct}
              onChange={this.handleRadioChange} /> dollars
          </label> <label>
            <input
              name="usePct"
              type="radio"
              value="pct"
              checked={this.state.usePct}
              onChange={this.handleRadioChange} /> percentage
          </label>
        </div>
        <Total data={budgets} colors={colors} diffColors={diffColors} usePct={this.state.usePct}></Total>
      </div>
      <div className="col-sm-6">
        <h3>Spending by Department</h3>
        <DiffTable data={budgets}
          colors={colors} diffColors={diffColors}
          usePct={this.state.usePct} diffKey={'depts'}></DiffTable>
        <h3>Departments Added/Removed</h3>
        <AddRemove data={budgets} colors={colors} diffKey={'depts'}></AddRemove>
      </div>
      <div className="col-sm-6">
        <h3>Spending by Category</h3>
        <DiffTable data={budgets}
          colors={colors} diffColors={diffColors}
          usePct={this.state.usePct} diffKey={'categories'}></DiffTable>
      </div>
    </div>
  }
}

ReactDOM.render(
  <Compare/>,
  document.getElementById('root')
);