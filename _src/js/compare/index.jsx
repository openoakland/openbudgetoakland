import React from 'react';
import ReactDOM from 'react-dom';

class Compare extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <h2>diff</h2>
    </div>
  }
}

ReactDOM.render(
  <Compare/>,
  document.getElementById('root')
);