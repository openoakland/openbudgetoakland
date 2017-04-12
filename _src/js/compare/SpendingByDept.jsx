import React from 'react';
import axios from 'axios';

import DiffTable from './DiffTable.jsx';
import AddRemove from './AddRemove.jsx';
import {API_URL} from './utils.jsx';

// TODO: dynamically choose via props
const YEARS = ['16-17', '14-15'];

export default class SpendingByDept extends React.Component {
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
      {
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
        "Non-Departmental": 326058462,
      },
    ];
    this.setState({budgets});
  }

  // TODO: special state when there are no differences?
  render () {
      /*<h3>Departments Added/Removed</h3>
      <AddRemove data={this.state.budgets} years={YEARS}
        colors={this.props.colors}>
      </AddRemove>*/
    return <div>
      <DiffTable data={this.state.budgets}
        colors={this.props.colors} diffColors={this.props.diffColors}
        usePct={this.props.usePct}></DiffTable>
    </div>

  }
}
