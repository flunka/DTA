import React from 'react';

import {Button, Popover, OverlayTrigger, Overlay} from 'react-bootstrap';

class RunButton extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = ({ target }) => {
      this.setState(s => ({ target, show: !s.show }));
    };

    this.state = {
      show: false,
    };
  }
  renderButton(text,disabled){
    return(
      <Button 
        variant="secondary" type="submit" 
        block
        onClick={() => this.setState({show:!this.state.show})}
        disabled={disabled}>
        {text}
      </Button>
      );
  }
  renderPopover(){
    return(
        <Popover  title="Compare adjusted realization with" >
          {this.renderButton('Adjusted plan',false)}
          {this.renderButton('Aligned plan',!this.props.aligned)}
        </Popover>
      )
  };

  render(){
    
    var popover = (
        <Popover  title="Compare adjusted realization with"  >
          <Button variant="secondary" type="submit" 
            block>
            Adjusted plan
          </Button>
          <Button variant="secondary" type="submit" 
            block disabled={!this.props.aligned}>
            Aligned plan
          </Button> 
        </Popover>
      );
    
    return(
      <div>
        <Button 
          variant='secondary'
          block
          disabled={this.props.disabled}
          onClick={this.handleClick}>Run
        </Button>

        <Overlay
          show={this.state.show}
          target={this.state.target}
          placement="right"
          container={this}
        >
          {this.renderPopover()}
        </Overlay>
      </div>

      
      )
  }
}

export default RunButton