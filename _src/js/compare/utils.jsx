import React from 'react';
import {format} from 'd3-format';

export const asTick = format('$,.1f');

export const asDollars = format('+$,');

export const asPct = format('+.2%');

export const API_URL = '//dev-open-budget-oakland-administration.pantheonsite.io/wp-json/obo/v1/fiscal-years-expenses/';

export const BUDGET_TYPES = {
  '1': 'Adopted',
  '2': 'Proposed',
  '3': 'Council Proposed', // ?? not a thing
  '4': 'Adjusted', // to be implemented
};

export function asDiff (value, usePct) {
  // special handling for sentinel values
  switch (value) {
    case Infinity:
      return 'Newly Added'
    default:
      break;
  }
  // otherwise choose the appropriate formatting
  if (usePct) {
    return asPct(value);
  } else {
    return asDollars(value);
  }
}

export class DiffStyled extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    const style = {
      color: this.props.diff >= 0 ? this.props.colors.pos : this.props.colors.neg,
    }
    return <span style={style}> {asDiff(this.props.diff, this.props.usePct)}</span>
  }
}