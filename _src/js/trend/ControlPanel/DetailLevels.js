import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

// function nestList(array, index){
//   // recursively nest array items in list elements
//   if (index < array.length){
//     return <ListGroup>
//       <ListGroupItem active={this.state.detailLevel === array[index]}
//       onClick={this.setState({detailLevel: array[index]})}>
//         {array[index]}
//       </ListGroupItem>
//       {this.nestList(array, index + 1)}
//     </ListGroup>
//   }
// }

class DetailLevels extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return <div>detail levels</div>
  }
}

module.exports = DetailLevels;