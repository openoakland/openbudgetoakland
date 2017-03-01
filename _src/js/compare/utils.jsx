import React from 'react';
import {format} from 'd3-format';

export const asTick = format('$,.1f');

export const asDollars = format('+$,');

export const asPct = format('+.2%');

export function asDiff (value, usePct) {
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