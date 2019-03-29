import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';


import Sidebar from './Sidebar.jsx';
import MainPanel from './MainPanel.jsx';

class Content extends React.Component {
  constructor(props){
    super(props);
    /*var uploadButton = {
      file: null,
      isLoading: false,
      isLoaded: false
    };*/

    this.sidebarClick = this.sidebarClick.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
    this.adjustOnClick = this.adjustOnClick.bind(this);
    this.alignOnClick = this.alignOnClick.bind(this);
    var actionButtons = Array(2).fill({
        done: false,
        text: null
      });
    actionButtons[0] = {
      text:'Adjust doses'
    };
    actionButtons[1] = {
      text: 'Align plan to realization'
    };
    this.state = {
      sidebar: Array(2).fill({
        methodToRender: 0
      }),
      uploadButtons: Array(2).fill({
        file: null,
        isLoading: false,
        isLoaded: false,
        variant: 'secondary'
      }),
      action: {
        buttons: actionButtons,
        adjustOnClick:this.adjustOnClick,
        alignOnClick: this.alignOnClick
      },
      
    };
  }

  handleSelectedFile(event, type){
    const uploadButtons = this.state.uploadButtons.slice();
    const action = this.state.action;
    var actionButtons = Array(2).fill({
        done: false,
        text: null
      });
    actionButtons[0] = {
      text:'Adjust doses'
    };
    actionButtons[1] = {
      text: 'Align plan to realization'
    };
    action.buttons = actionButtons;
    const file = event.target.files[0];
    uploadButtons[type] = {
      file: file,
      isLoading: true,
      isLoaded:false,
      variant: 'info'
    }

    this.setState({
      uploadButtons: uploadButtons,
      action: action
    });
    
    const form = new FormData();
    if (type == 0) {
      form.append('planned_dose_file', file)
    }
    else if (type == 1) {
      form.append('applied_dose_file', file);      
    }

    fetch(process.env.API_URL +'/Upload', { // Your POST endpoint
      method: 'POST',
      credentials: "include",
      body: form // This is your file object
    }).then(
      response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong');
        }
      }
    ).then(
      success => (
          uploadButtons[type] = {
            file: file,
            isLoading: false,
            isLoaded: true,
            variant: 'success'
          },
          this.setState({
            uploadButtons: uploadButtons
          })
        )
    ).catch(
      error => (
          uploadButtons[type] = {
            file: file,
            isLoading: false,
            isLoaded: false,
            variant: 'danger'
          },
          this.setState({
            uploadButtons: uploadButtons
          })
        ) // Handle the error response object
    );
  }

  sidebarClick(i, type){
    /* 
    type == 0 - dose change
    type == 1 - distance change
    */
    const sidebar = this.state.sidebar.slice();
    sidebar[type] = {
      methodToRender: i
    }
    this.setState({
      sidebar: sidebar
    }) 
  }

  adjustOnClick(){
    const buttons = this.state.action.buttons.slice();
    const action = this.state.action;
    buttons[0] = {
      text:'Adjusting doses...'
    };
    action.buttons = buttons;
    this.setState({
        action: action
      });
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
      success => (
          buttons[0] = {
            done: true,
            text: 'Adjusted!'
          },
          action.buttons = buttons,
          this.setState({action: action})
        )
    ).catch(
      error => (
          buttons[1] = {
            done: false,
            text: 'Error during adjustment!'
          },
          action.buttons = buttons,
          this.setState({action: action})
        )
    );
  }

  alignOnClick(){
    const buttons = this.state.action.buttons.slice();
    const action = this.state.action;
    buttons[1]= {
      text: 'Aligning doses...'
    };
    action.buttons = buttons;
    this.setState({
        action: action
      });
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
      success => (
          buttons[1] = {
            done: true,
            text: 'Aligned!'
          },
          action.buttons = buttons,
          this.setState({action: action})
        )
    ).catch(
      error => (
          buttons[1] = {
            done: false,
            text: 'Error during aligment!'
          },
          action.buttons = buttons,
          this.setState({action: action})
        )
    );
  }
 

  render(){
    return (
      <Row noGutters>          
        <Sidebar 
          buttonOnClick={this.sidebarClick}
          handleSelectedFile={this.handleSelectedFile}
          uploadButtons={this.state.uploadButtons}
          action={this.state.action} />    
        <MainPanel 
          sidebar={this.state.sidebar}          
          uploadButtons={this.state.uploadButtons} />
      </Row>
    )   
  }
}

export default Content