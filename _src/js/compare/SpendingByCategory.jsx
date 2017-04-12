import React from 'react';
import axios from 'axios';

import DiffTable from './DiffTable.jsx';
import AddRemove from './AddRemove.jsx';
import {API_URL} from './utils.jsx';

// TODO: dynamically choose via props
const YEARS = ['14-15', '13-14'];

export default class SpendingByCategory extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      budgets: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount () {
    // TODO: dynamically choose via props
    this.fetchData(YEARS);
  }

  fetchData (years) {
    // TODO: replace this dummy data with a real API query
    const budgets = [
      {
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
      {
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
    ];
    this.setState({budgets});
  }

  render () {
    return <div>
      <DiffTable data={this.state.budgets}
        colors={this.props.colors} diffColors={this.props.diffColors}
        usePct={this.props.usePct}></DiffTable>
    </div>
  }
}
