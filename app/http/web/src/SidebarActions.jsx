import React from 'react';

import {Alert, Collapse} from 'react-bootstrap';

import RunButton from './RunButton.jsx';
import ActionsBefore from './ActionsBefore.jsx';
import ActionsAfter from './ActionsAfter.jsx'

class SidebarActions extends React.Component {
  constructor(props){
    super(props);
  }

  renderSidebarLabel(text, index){
    return (
      <Alert 
        variant='dark' 
        className='m-0 p-0 text-center'
        onClick={() => this.props.labelOnClick(index)}
        aria-controls="example-collapse-text"
        aria-expanded={this.props.isOpen}>
        {text}
      </Alert>
      )
  }

  render(){
    return(
      <div>
        {this.renderSidebarLabel("Actions", this.props.label_id)}
        <Collapse in={this.props.isOpen}>
          <div>
            {this.props.results.status === "before" &&
              <ActionsBefore 
                action={this.props.action}
                uploadButtons={this.props.uploadButtons}
                run={this.props.run}
                handleSelectedFile={this.props.handleSelectedFile}/>
            }
            {this.props.results.status === "process" &&
              <div></div>
            }
            {this.props.results.status === "after" &&
              <ActionsAfter
              results={this.props.results} />
            }
          </div>
        </Collapse>
      </div>

      )
  }
}

export default SidebarActions