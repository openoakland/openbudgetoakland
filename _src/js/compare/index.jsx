import React from "react";
import ReactDOM from "react-dom";
import { Nav, NavItem, Tab } from "react-bootstrap";
import Select from "react-select";
import { schemeSet2 as colors } from "d3-scale-chromatic";

import "react-select/dist/react-select.css";

import Total from "./Total.jsx";
import { BUDGET_TYPES } from "./utils.jsx";
import { fetchTotals } from "./api.js";
import Breakdown from "./Breakdown.jsx";

const styles = [{ color: colors[0] }, { color: colors[1] }];
const diffColors = {
  neg: "#e41a1c",
  pos: "#4daf4a",
};

function getBudgetOption(record, index) {
  return {
    value: index,
    label: `${record.fiscal_year_range} ${BUDGET_TYPES[record.budget_type]}`,
  };
}

function getBudgetDefaults(budgets) {
  // TODO: add a more sophisiticated selection algorithm;
  // e.g. find current year, compare adopted to proposed,
  // or proposed to previous adopted, etc
  let index1 = 0;
  let index2 = 1;
  // 19-20 proposed, if we have it
  const currI = budgets.findIndex(record => {
    return record.label === "FY19-20 Adopted";
  });
  // 18-19 proposed, if we have it
  const prevI = budgets.findIndex(record => {
    return record.label === "FY18-19 Adopted";
  });
  // if we have both, use their indexes instead
  if (currI > -1 && prevI > -1) {
    index1 = currI;
    index2 = prevI;
  }
  return [budgets[index1], budgets[index2]];
}

class Compare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changeType: "pct",
      usePct: true,
      budgetChoices: [],
      totals: [],
    };
    this.updateChangeType = this.updateChangeType.bind(this);
    this.selectBudget = this.selectBudget.bind(this);
    this.selectBudget1 = this.selectBudget1.bind(this);
    this.selectBudget2 = this.selectBudget2.bind(this);
  }

  componentDidMount() {
    fetchTotals().then(totals => {
      const budgetChoices = totals.map(getBudgetOption);
      const defaultChoices = getBudgetDefaults(budgetChoices);
      this.setState({
        budgetChoices,
        totals,
        budget1Choice: defaultChoices[0].value,
        budget1: totals[defaultChoices[0].value],
        budget2Choice: defaultChoices[1].value,
        budget2: totals[defaultChoices[1].value],
      });
      const budget1Options = budgetChoices.slice();
      const budget2Options = budgetChoices.slice();
      budget1Options.splice(this.state.budget2Choice, 1);
      budget2Options.splice(this.state.budget1Choice, 1);
      this.setState({
        budget1Options,
        budget2Options,
      });
    });
  }

  updateChangeType(event) {
    const target = event.target;
    this.setState({
      changeType: target.value,
    });
  }

  selectBudget1(option) {
    this.selectBudget("budget1", "budget2", option.value);
  }

  selectBudget2(option) {
    this.selectBudget("budget2", "budget1", option.value);
  }

  selectBudget(key, otherKey, index) {
    // No change if same selection
    if (this.state[`${key}Choice`] === index) {
      return;
    }

    let otherBudgetOptions = this.state.budgetChoices.slice();
    otherBudgetOptions.splice(index, 1);
    this.setState({
      [`${key}Choice`]: index,
      [key]: this.state.totals[index],
      [`${otherKey}Options`]: otherBudgetOptions,
    });
  }

  render() {
    const usePct = this.state.changeType === "pct";
    const selectedYears = [this.state.budget1, this.state.budget2];
    const totals = selectedYears.map(record => {
      if (record) {
        return {
          key: record.fiscal_year_range,
          total: record.total,
        };
      }
    });

    return (
      <div>
        <div className="row">
          <div className="col-sm-10">
            <h1>
              Compare{" "}
              <span style={styles[0]} className="choose-budget">
                <Select
                  options={this.state.budget1Options}
                  value={this.state.budget1Choice}
                  onChange={this.selectBudget1}
                  searchable={false}
                  clearable={false}
                />
              </span>{" "}
              with{" "}
              <span style={styles[1]} className="choose-budget">
                <Select
                  options={this.state.budget2Options}
                  value={this.state.budget2Choice}
                  onChange={this.selectBudget2}
                  searchable={false}
                  clearable={false}
                />
              </span>
            </h1>
          </div>
          <div className="col-sm-2">
            <div className="form-group">
              <label>Show changes as:</label>
              <select
                className="form-control"
                id="sortControl"
                value={this.state.changeType}
                onChange={this.updateChangeType}>
                <option value="pct">percentage</option>
                <option value="usd">dollars</option>
              </select>
            </div>
          </div>
          <div className="col-sm-12">
            <Total
              data={totals}
              colors={colors}
              diffColors={diffColors}
              usePct={usePct}></Total>
            <h2>Budget breakdowns</h2>
            <p>
              Get more detail on where money came from and how it was spent.
            </p>
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
              </Nav>
            </div>
            <div className="col-sm-9">
              <Tab.Content mountOnEnter>
                <Tab.Pane eventKey="spendDept">
                  <Breakdown
                    colors={colors}
                    diffColors={diffColors}
                    usePct={usePct}
                    years={selectedYears}
                    type="spending"
                    dimension="department"></Breakdown>
                </Tab.Pane>
                <Tab.Pane eventKey="spendCat">
                  <Breakdown
                    colors={colors}
                    diffColors={diffColors}
                    usePct={usePct}
                    years={selectedYears}
                    type="spending"
                    dimension="category"></Breakdown>
                </Tab.Pane>
                <Tab.Pane eventKey="revDept">
                  <Breakdown
                    colors={colors}
                    diffColors={diffColors}
                    usePct={usePct}
                    years={selectedYears}
                    type="revenue"
                    dimension="department"></Breakdown>
                </Tab.Pane>
                <Tab.Pane eventKey="revCat">
                  <Breakdown
                    colors={colors}
                    diffColors={diffColors}
                    usePct={usePct}
                    years={selectedYears}
                    type="revenue"
                    dimension="category"></Breakdown>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    );
  }
}

ReactDOM.render(<Compare />, document.getElementById("root"));
