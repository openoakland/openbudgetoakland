import React from 'react';
import ReactDOM from 'react-dom';

class Compare extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <h2>Compare <strong>Budget 2</strong> to <strong>Budget 1</strong></h2>
      <Total></Total>
      <Depts></Depts>
      <Categories></Categories>
    </div>
  }
}

class Total extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <h3>total</h3>
      <p>+$97.7M</p>
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