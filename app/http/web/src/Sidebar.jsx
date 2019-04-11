import React from 'react';
import {Col, Button,} from 'react-bootstrap';
import SidebarAsessment from './SidebarAsessment.jsx';
import SidebarActions from './SidebarActions.jsx'

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
    this.sidebarOnClick = this.sidebarOnClick.bind(this);
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
        <SidebarActions 
          label_id={0}
          isOpen={this.state.navItems[0].isOpen}
          labelOnClick={this.sidebarOnClick}
          action={this.props.action}
          uploadButtons={this.props.uploadButtons}
          run={this.props.run}
          handleSelectedFile={this.props.handleSelectedFile}
          results={this.props.results}
          />
        
        {this.props.results.status === "before" &&
          <SidebarAsessment
            label_text="Dose quality assessment"
            label_id={1}
            isOpen={this.state.navItems[1].isOpen}
            assessment_id={0}
            buttonOnClick={this.props.buttonOnClick}
            labelOnClick={this.sidebarOnClick}/>
        }
        {this.props.results.status === "before" &&
          <SidebarAsessment
            label_text="Distance to agreement assessment"
            label_id={2}
            isOpen={this.state.navItems[2].isOpen}
            assessment_id={1}
            buttonOnClick={this.props.buttonOnClick}
            labelOnClick={this.sidebarOnClick}/>
        }
        
      </Col>
    )

  }
  
}

export default Sidebar