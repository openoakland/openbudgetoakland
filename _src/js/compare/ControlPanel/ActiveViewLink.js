import React from 'react';
import {ListGroupItem} from 'react-bootstrap';

class ActiveViewLink extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    this.props.updateView(this.props.viewName);
  }

  render(){
    return <ListGroupItem active={this.props.active} onClick={this.handleClick}>
        {this.props.children}
    </ListGroupItem>
  }
}

module.exports = ActiveViewLink;