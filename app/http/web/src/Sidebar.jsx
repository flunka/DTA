import React from 'react';
import {Alert, Col, Button, Collapse} from 'react-bootstrap'

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      doseIsOpen: false,
      distanceIsOpen: false
    }
  }

  renderSidebarButton(name, i, type){
    return (
        <Button variant="secondary" className="m-0" block onClick={() => this.props.buttonOnClick(i, type)}>{name}</Button>
      )
  }

  sidebarOnClick(i){
    if (i==1) {
      this.setState({ doseIsOpen: !this.state.doseIsOpen})
    }
    else if (i==2) {
      this.setState({ distanceIsOpen: !this.state.distanceIsOpen})
    }
    
  }

  render(){
    return (
      <Col sm={3} id="sidebar">
        <Alert 
          variant='dark' 
          className='m-0 p-0 text-center'
          onClick={() => this.sidebarOnClick(1)}
          aria-controls="dose-method"
          aria-expanded={this.state.doseIsOpen}>
          Dose quality assessment
        </Alert>
        <Collapse in={this.state.doseIsOpen}>
          <div id="dose-method">
            {this.renderSidebarButton("Global method", 0, 1)}
            {this.renderSidebarButton("Clustering method", 1, 1)}
            {this.renderSidebarButton("Point-wise local method", 2, 1)}
          </div>
        </Collapse>
        <Alert 
          variant='dark' 
          className='m-0 p-0 text-center'
          onClick={() => this.sidebarOnClick(2)}
          aria-controls="example-collapse-text"
          aria-expanded={this.state.distanceIsOpen}>
          Distance to agreement assessment
        </Alert>
        <Collapse in={this.state.distanceIsOpen}>
          <div id="distance-method">
            {this.renderSidebarButton("Global method", 0, 2)}
            {this.renderSidebarButton("Clustering method", 1, 2)}
            {this.renderSidebarButton("Point-wise local method", 2, 2)}
          </div>
        </Collapse>
      </Col>
    )

  }
  
}

export default Sidebar