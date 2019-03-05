import React from 'react';
import {Alert, Col, Button} from 'react-bootstrap'

class Sidebar extends React.Component {
  constructor(props){
    super(props);
  }

  renderSidebarButton(name, i, type){
    return (
        <Button variant="secondary" className="m-0" block onClick={() => this.props.buttonOnClick(i, type)}>{name}</Button>
      )
  }

  render(){
    return (
      <Col sm={3} id="sidebar">
        <Alert variant='dark' className='m-0 p-0 text-center'>Dose quality assessment</Alert>
        {this.renderSidebarButton("Global method", 0, 1)}
        {this.renderSidebarButton("Clustering method", 1, 1)}
        {this.renderSidebarButton("Point-wise local method", 2, 1)}
        <Alert variant='dark' className='m-0 p-0 text-center'>Distance to agreement assessment</Alert>
        {this.renderSidebarButton("Global method", 0, 2)}
        {this.renderSidebarButton("Clustering method", 1, 2)}
        {this.renderSidebarButton("Point-wise local method", 2, 2)}
      </Col>
    )

  }
  
}

export default Sidebar