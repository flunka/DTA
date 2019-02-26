import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';


import Sidebar from './Sidebar.jsx';
import MainPanel from './MainPanel.jsx';

class Content extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toRender: 0
    }
    this.sidebarClick = this.sidebarClick.bind(this);
  }

  sidebarClick(i){
    this.setState({toRender: i});
  }

  render(){
    return (
      <Row noGutters>          
        <Sidebar buttonOnClick={this.sidebarClick} />          
        <MainPanel toRender={this.state.toRender} />
      </Row>
    )   
  }
}

export default Content