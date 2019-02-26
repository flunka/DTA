import React from 'react';
import {Col, Button} from 'react-bootstrap'

class Sidebar extends React.Component {
  constructor(props){
    super(props);
  }

  renderSidebarButton(name, i){
    return (
        <Button variant="secondary" className="m-0" block onClick={() => this.props.buttonOnClick(i)}>{name}</Button>
      )
  }

  render(){
    return (
      <Col sm={3} id="sidebar">
        {this.renderSidebarButton("Global mathod", 0)}
        {this.renderSidebarButton("Clustering mathod", 1)}
        {this.renderSidebarButton("Point-wise local mathod", 2)}
      </Col>
    )

  }
  
}

export default Sidebar