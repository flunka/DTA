import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';


import Sidebar from './Sidebar.jsx';
import MainPanel from './MainPanel.jsx';

class Content extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      doseMethodToRender: 0,
      distanceMethodToRender: 0
    }
    this.sidebarClick = this.sidebarClick.bind(this);
  }

  sidebarClick(i, type){
    /* 
    type == 1 - dose change
    type == 2 - distance change
    */
    if (type==1) {
      this.setState({doseMethodToRender: i});
    }
    else if (type == 2) {
      this.setState({distanceMethodToRender: i});
    }
    
  }

  render(){
    return (
      <Row noGutters>          
        <Sidebar buttonOnClick={this.sidebarClick} />          
        <MainPanel 
          doseMethodToRender={this.state.doseMethodToRender}
          distanceMethodToRender={this.state.distanceMethodToRender} />
      </Row>
    )   
  }
}

export default Content