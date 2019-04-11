import React from 'react';
import {Row, Col, Button, Form} from 'react-bootstrap';
import {RingLoader} from 'react-spinners';



import Sidebar from './Sidebar.jsx';
import MainPanel from './MainPanel.jsx';
import ResultPanel from './ResultPanel.jsx';

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
    this.runOnClick =this.runOnClick.bind(this);
    this.resetResults = this.resetResults.bind(this);
    var actionButtons = Array(2).fill({
        done: false,
        doing: false,
        text: null,
        variant: 'secondary'
      });
    actionButtons[0] = {
      text:'Adjust doses',
      variant: 'secondary'
    };
    actionButtons[1] = {
      text: 'Align plan to realization',
      variant: 'secondary'
    };
    this.state = {
      sidebar: Array(2).fill({
        methodToRender: 'global'
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
      chosen_plan: null,
      results: {
        status: "before",
        gamma: "",
        dose_diff: "",
        van_dyk: "",
        reset: this.resetResults
      },
      
    };
  }

  handleSelectedFile(event, type){
    var uploadButtons = this.state.uploadButtons.slice();
    const action = this.state.action;
    var actionButtons = Array(2).fill({
        done: false,
        doing: false,
        text: null,
        variant: 'secondary'
      });
    actionButtons[0] = {
      text:'Adjust doses',      
      variant: 'secondary'
    };
    actionButtons[1] = {
      text: 'Align plan to realization',
      variant: 'secondary'
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
          uploadButtons = this.state.uploadButtons.slice(),
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
          uploadButtons = this.state.uploadButtons.slice(),
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
      text:'Adjusting doses...',
      doing: true,
      variant: 'info'
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
            doing: false,
            text: 'Adjusted!',
            variant: 'success'
          },
          action.buttons = buttons,
          this.setState({action: action})
        )
    ).catch(
      error => (
          buttons[0] = {
            done: false,
            doing: false,
            text: 'Error during adjustment!',
            variant: 'danger'
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
      text: 'Aligning doses...',
      doing: true,
      variant: 'info'
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
            doing: false,
            text: 'Aligned!',
            variant: 'success'
          },
          action.buttons = buttons,
          this.setState({action: action})
        )
    ).catch(
      error => (
          buttons[1] = {
            done: false,
            doing: false,
            text: 'Error during aligment!',
            variant: 'danger'
          },
          action.buttons = buttons,
          this.setState({action: action})
        )
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.chosen_plan != null){
      const data = new FormData(event.target);
      data.append('DQA_method', this.state.sidebar[0].methodToRender);
      data.append('DTA_method', this.state.sidebar[1].methodToRender);
      var results = this.state.results;
      results.status = "process";
      this.setState({"results": results})
      fetch(process.env.API_URL + '/Run?plan=' + this.state.chosen_plan, {
        method: 'POST',
        credentials: "include",
        body: data,
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
          results.status = "after",
          results.gamma = success.gamma,
          results.dose_diff = success.dose_diff,
          results.van_dyk = success.van_dyk,
          this.setState({"results": results})
        )
    ).catch(
      error => (
          results.status = "after",
          this.setState({"results": results})
        )
    );      
      this.setState({chosen_plan: null});
    }
  } 

  runOnClick(plan){
    this.setState({chosen_plan: plan});
  }

  resetResults(){
    var results = this.state.results;
    results.status = "before";
    results.gamma = "";
    results.dose_diff = "";
    results.van_dyk = "";
    this.setState({results:results});
  }


 

  render(){
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Row noGutters>          
            <Sidebar 
              buttonOnClick={this.sidebarClick}
              handleSelectedFile={this.handleSelectedFile}
              uploadButtons={this.state.uploadButtons}
              action={this.state.action}
              run={this.runOnClick}
              results={this.state.results} />    
            {this.state.results.status === "before" && 
              <MainPanel 
                sidebar={this.state.sidebar}          
                uploadButtons={this.state.uploadButtons} />
            }
            {this.state.results.status === "process" && 
              <Col sm={9} >
                <Row noGutters className="d-flex justify-content-center align-self-stretch">Processing your request...</Row>
                <Row noGutters className="d-flex justify-content-center align-self-stretch">
                  <RingLoader/>
                </Row>
              </Col>
            }
            {this.state.results.status === "after" &&
              <ResultPanel
                results={this.state.results} />
            }
        </Row>
      </Form>
    )   
  }
}

export default Content