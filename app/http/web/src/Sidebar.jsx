import React from 'react';
import {Alert, Col, Button, Collapse} from 'react-bootstrap';
import ShowButton from './ShowButton.jsx';

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      navItems: Array(3).fill({
        isOpen: false
      }),
      adjusted: false,
      aligned: false
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

  adjustOnClick(){
    fetch(process.env.API_URL +'/AdjustDoses', { // Your POST endpoint
      method: 'GET',
      credentials: "include",
    }).then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      }
    ).then(
      success => this.setState({
        adjusted:true
      })
    ).catch(
      error => console.log("Error!")// Handle the error response object
    );
  }

  alignOnClick(){
    fetch(process.env.API_URL +'/AlignDoses', { // Your POST endpoint
      method: 'GET',
      credentials: "include",
    }).then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      }
    ).then(
      success => this.setState({
        adjusted:true,
        aligned:true
      })
    ).catch(
      error => console.log("Error!")// Handle the error response object
    );
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
            <ShowButton text="Plan"
              type='planned'
              disable={!this.props.uploadButtons[0].isLoaded} />
            <label className="m-0 w-100">
              <input type="file" 
                onChange={(event) => this.props.handleSelectedFile(event, 1)} 
                />
              <Button className="m-0" as={Col} variant="secondary" block>
              Browse applied dose file
              </Button>
            </label> 
            <ShowButton text="Realization"
              type='applied'
              disable={!this.props.uploadButtons[1].isLoaded} />
            <Button className="m-0" variant="secondary" block
              onClick={() => this.adjustOnClick()}
              disabled={
                !this.props.uploadButtons[0].isLoaded || 
                !this.props.uploadButtons[1].isLoaded}
            >Adjust doses
            </Button>
            <ShowButton text="Adjusted"
              type='adjusted'
              disable={!this.state.adjusted} />
            <Button className="m-0" variant="secondary" block
              onClick={() => this.alignOnClick()}
              disabled={!this.state.adjusted}
            >Align doses
            </Button>
            <ShowButton text="Aligned"
              type='aligned'
              disable={!this.state.aligned} />
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