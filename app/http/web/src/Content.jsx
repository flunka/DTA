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
    this.state = {
      doseMethodToRender: 0,
      distanceMethodToRender: 0,
      uploadButtons: Array(2).fill({
        file: null,
        isLoading: false,
        isLoaded: false
      })
    };
    this.sidebarClick = this.sidebarClick.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
  }

  handleSelectedFile(event, type){
    const uploadButtons = this.state.uploadButtons.slice();
    uploadButtons[type] = {
      file: event.target.files[0],
      isLoading: false,
      isLoaded: false
    }
    this.setState({
      uploadButtons: uploadButtons
    });
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

  handeClickUploadButton(type) {
    const uploadButtons = this.state.uploadButtons.slice();
    uploadButtons[type] = {
      file: uploadButtons[type].file,
      isLoading: true,
      isLoaded:false
    }
    this.setState({uploadButtons: uploadButtons});
    const file = uploadButtons[type].file;
    
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
      response => response.json() // if the response is a JSON object
    ).then(
      success => (
          uploadButtons[type] = {
            isLoading: false,
            isLoaded: true
          },
          this.setState({
            uploadButtons: uploadButtons
          })
        )
    ).catch(
      error => (
          uploadButtons[type] = {
            isLoading: false,
            isLoaded: false
          },
          this.setState({
            uploadButtons: uploadButtons
          })
        ) // Handle the error response object
    );
  }

  render(){
    return (
      <Row noGutters>          
        <Sidebar buttonOnClick={this.sidebarClick} />    
        <MainPanel 
          doseMethodToRender={this.state.doseMethodToRender}
          distanceMethodToRender={this.state.distanceMethodToRender}
          handleSelectedFile={this.handleSelectedFile}
          uploadButtons={this.state.uploadButtons}
          handeClickUploadButton={this.handeClickUploadButton.bind(this)} />
      </Row>
    )   
  }
}

export default Content