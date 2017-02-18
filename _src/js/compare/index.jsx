import React from 'react';
import ReactDOM from 'react-dom';
import {schemeSet2 as colors} from 'd3-scale-chromatic';

import Total from './Total.jsx';

const styles = [
  {color: colors[0]},
  {color: colors[1]},
];
const diffColors = {
  neg: '#e41a1c',
  pos: '#4daf4a',
};
const budgets = [
  {key: 'Budget 2', total: 1202960209},
  {key: 'Budget 1', total: 1182157681},
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
    return <div>
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
      <Depts></Depts>
      <Categories></Categories>
    </div>
  }
}

class Depts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const deptList = [10, 8, 7.5, 4, 2, 1].map((v, i) => {
      return <div>
        <dt>Department {i}</dt>
        <dd>+{v}</dd>
      </div>
    })

    return <div>
      <h3>departments</h3>
      <dl>
        {deptList}
      </dl>
    </div>
  }
}

class Categories extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const categoryList = [10, 8, 7.5, 4, 2, 1].map((v, i) => {
      return <div>
        <dt>Category {i}</dt>
        <dd>+{v}</dd>
      </div>
    })

    return <div>
      <h3>categories</h3>
      <dl>
        {categoryList}
      </dl>
    </div>
  }
}

ReactDOM.render(
  <Compare/>,
  document.getElementById('root')
);