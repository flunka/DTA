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
      sidebar: Array(2).fill({
        methodToRender: 0
      }),
      uploadButtons: Array(2).fill({
        file: null,
        isLoading: false,
        isLoaded: false,
        variant: 'secondary'
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
      isLoaded: false,
      variant: 'info'
    }
    this.setState({
      uploadButtons: uploadButtons
    });
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

  handeClickUploadButton(type) {
    const uploadButtons = this.state.uploadButtons.slice();
    uploadButtons[type] = {
      file: uploadButtons[type].file,
      isLoading: true,
      isLoaded:false,
      variant: 'info'
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

  render(){
    return (
      <Row noGutters>          
        <Sidebar 
          buttonOnClick={this.sidebarClick}
          handleSelectedFile={this.handleSelectedFile} />    
        <MainPanel 
          sidebar={this.state.sidebar}          
          uploadButtons={this.state.uploadButtons}
          handeClickUploadButton={this.handeClickUploadButton.bind(this)} />
      </Row>
    )   
  }
}

export default Content