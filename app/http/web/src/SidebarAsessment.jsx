import React from 'react';

import {Alert, Button, Collapse} from 'react-bootstrap';

class SidebarAsessment extends React.Component {
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

  renderSidebarButton(name, method, type){
    return (
        <Button variant="secondary" className="m-0" block onClick={() => this.props.buttonOnClick(method, type)}>{name}</Button>
      )
  }

  render(){
    return(
      <div>
        {this.renderSidebarLabel(this.props.label_text,this.props.label_id)}
        <Collapse in={this.props.isOpen}>
          <div>
            {this.renderSidebarButton("Global method", 'global', this.props.assessment_id)}
            {this.renderSidebarButton("Clustering method", 'clustering', this.props.assessment_id)}
            {this.renderSidebarButton("Point-wise local method", 'local', this.props.assessment_id)}
          </div>
        </Collapse>
      </div>
      )
  }
}

export default SidebarAsessment