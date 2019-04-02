import React from 'react';
import {Alert, Col, Button, Collapse} from 'react-bootstrap';
import ShowButton from './ShowButton.jsx';
import RunButton from './RunButton.jsx';

class Sidebar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      navItems: Array(3).fill({
        isOpen: false
      }),
      images: Array(5).fill({
        z: 0
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

  imageOnClick(num){
    var images = this.state.images.slice();
    for (var i = 0, len = images.length; i < len; i++) {
      if (images[i].z > 0) {
        images[i].z = images[i].z- 1;  
      }      
    }
    images[num] = {
      z: 5
    };
    this.setState({
      images: images
    })

  }

  renderUploadButton(text, index){
    return(
      <label className="m-0 w-100">
        <input type="file" 
          onChange={(event) => this.props.handleSelectedFile(event, index)} 
          />
        <Button className="m-0" as={Col} variant="secondary" block>
          {text}
        </Button>
      </label> 
      )
  }

  renderSidebarLabel(text, index){
    return (
      <Alert 
        variant='dark' 
        className='m-0 p-0 text-center'
        onClick={() => this.sidebarOnClick(index)}
        aria-controls="example-collapse-text"
        aria-expanded={this.state.navItems[index].isOpen}>
        {text}
      </Alert>
      )
  }


  render(){
    return (
      <Col sm={3} id="sidebar">
        {this.renderSidebarLabel("Actions", 0)}
        <Collapse in={this.state.navItems[0].isOpen}>
          <div id="actions">
            <RunButton
              disabled={!this.props.action.buttons[0].done}
              aligned={this.props.action.buttons[1].done}>
            </RunButton>
            {this.renderUploadButton('Browse planned dose file', 0)}
            <ShowButton text="Plan"
              zIndex={this.state.images[0].z}
              imageOnClick={()=> this.imageOnClick(0)}
              type='planned'
              disabled={!this.props.uploadButtons[0].isLoaded} />
            {this.renderUploadButton('Browse applied dose file', 1)}
            <ShowButton text="Realization"
              zIndex={this.state.images[1].z}
              imageOnClick={()=> this.imageOnClick(1)}
              type='applied'
              disabled={!this.props.uploadButtons[1].isLoaded} />
            <Button className="m-0" 
              variant={this.props.action.buttons[0].variant} 
              block
              onClick={() => this.props.action.adjustOnClick()}
              disabled={
                !this.props.uploadButtons[0].isLoaded || 
                !this.props.uploadButtons[1].isLoaded ||
                this.props.action.buttons[0].done ||
                this.props.action.buttons[0].doing
              }
            >{this.props.action.buttons[0].text}
            </Button>
            <ShowButton text="Adjusted plan"
              zIndex={this.state.images[2].z}
              imageOnClick={()=> this.imageOnClick(2)}
              type='adjusted_planned'
              disabled={!this.props.action.buttons[0].done} />
            <ShowButton text="Adjusted realization"
              zIndex={this.state.images[3].z}
              imageOnClick={()=> this.imageOnClick(3)}
              type='adjusted_applied'
              disabled={!this.props.action.buttons[0].done} />
            <Button className="m-0" 
              variant={this.props.action.buttons[1].variant} 
              block
              onClick={() => this.props.action.alignOnClick()}
              disabled={
                !this.props.action.buttons[0].done ||
                this.props.action.buttons[1].done ||
                this.props.action.buttons[1].doing
              }
            >{this.props.action.buttons[1].text}
            </Button>
            <ShowButton text="Aligned"
              zIndex={this.state.images[4].z}
              imageOnClick={()=> this.imageOnClick(4)}
              type='aligned'
              disabled={!this.props.action.buttons[1].done} />
          </div>
        </Collapse>
        {this.renderSidebarLabel("Dose quality assessment", 1)}
        <Collapse in={this.state.navItems[1].isOpen}>
          <div id="dose-method">
            {this.renderSidebarButton("Global method", 0, 0)}
            {this.renderSidebarButton("Clustering method", 1, 0)}
            {this.renderSidebarButton("Point-wise local method", 2, 0)}
          </div>
        </Collapse>
        {this.renderSidebarLabel("Distance to agreement assessment",2)}
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