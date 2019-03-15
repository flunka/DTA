import React from 'react';
import {Alert, Col, Button, Collapse} from 'react-bootstrap';
import ShowButton from './ShowButton.jsx';

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      navItems: Array(3).fill({
        isOpen: false
      })
    }
  }

  renderSidebarButton(name, i, type){
    return (
        <Button variant="secondary" className="m-0" block onClick={() => this.props.buttonOnClick(i, type)}>{name}</Button>
      )
  }

  sidebarOnClick(i){
    const navItems = this.state.navItems.slice();
    navItems[i] = {
      isOpen: !this.state.navItems[i].isOpen
    }
    this.setState({
      navItems: navItems
    })
    
  }

  render(){
    return (
      <Col sm={3} id="sidebar">
        <Alert 
          variant='dark' 
          className='m-0 p-0 text-center'
          onClick={() => this.sidebarOnClick(0)}
          aria-controls="example-collapse-text"
          aria-expanded={this.state.navItems[0].isOpen}>
          Actions
        </Alert>
        <Collapse in={this.state.navItems[0].isOpen}>
          <div id="actions">
            <Button variant="secondary" type="submit" block>Run</Button>
            <label className="m-0 w-100">
              <input type="file" 
                onChange={(event) => this.props.handleSelectedFile(event, 0)} 
                />
              <Button className="m-0" as={Col} variant="secondary" block>
              Browse planned dose file
              </Button>
            </label> 
            <ShowButton text="Show Plan"
              type='planned' />
            <label className="m-0 w-100">
              <input type="file" 
                onChange={(event) => this.props.handleSelectedFile(event, 1)} 
                />
              <Button className="m-0" as={Col} variant="secondary" block>
              Browse applied dose file
              </Button>
            </label> 
            <ShowButton text="Show Realization"
              type='applied' />
            <Button className="m-0" variant="secondary" block>Adjust doses
            </Button>
            <Button className="m-0" variant="secondary" block>Align doses
            </Button>
          </div>
        </Collapse>
        <Alert 
          variant='dark' 
          className='m-0 p-0 text-center'
          onClick={() => this.sidebarOnClick(1)}
          aria-controls="dose-method"
          aria-expanded={this.state.navItems[1].isOpen}>
          Dose quality assessment
        </Alert>
        <Collapse in={this.state.navItems[1].isOpen}>
          <div id="dose-method">
            {this.renderSidebarButton("Global method", 0, 0)}
            {this.renderSidebarButton("Clustering method", 1, 0)}
            {this.renderSidebarButton("Point-wise local method", 2, 0)}
          </div>
        </Collapse>
        <Alert 
          variant='dark' 
          className='m-0 p-0 text-center'
          onClick={() => this.sidebarOnClick(2)}
          aria-controls="example-collapse-text"
          aria-expanded={this.state.navItems[2].isOpen}>
          Distance to agreement assessment
        </Alert>
        <Collapse in={this.state.navItems[2].isOpen}>
          <div id="distance-method">
            {this.renderSidebarButton("Global method", 0, 1)}
            {this.renderSidebarButton("Clustering method", 1, 1)}
            {this.renderSidebarButton("Point-wise local method", 2, 1)}
          </div>
        </Collapse>
        
      </Col>
    )

  }
  
}

export default Sidebar