import React from 'react';

import {Button, Popover, Overlay, Image, Alert} from 'react-bootstrap';
import {Rnd} from 'react-rnd';

class ShowButon extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      url: "",
      show: false
    };

    this.get_image = this.get_image.bind(this);
  }

  get_image(type){
    fetch(process.env.API_URL + '/GetImage?' + type + '=true', { // Your POST endpoint
      method: 'GET',
      credentials: "include"
    }).then(
      response => (response.json()) // if the response is a JSON object
    ).then(
      success => (
          this.setState({
            url: success.image,
            show: !this.state.show
          })
        )
    ).catch(
      error => (
          console.log(error)
        ) // Handle the error response object
    );
  }
  render(){
    const popover = (
        <Rnd className="popover position-absolute" 
          default={{
            x: 0,
            y: 0,
          }}
          minWidth={250}
          maxWidth={650}
          lockAspectRatio={true}
        >
          <Alert variant='dark' className="m-0 p-0 h-auto text-center">{this.props.text} image</Alert>
          <img className="image" src={this.state.url} />
        </Rnd>        
    );
    return(
      <div>
        <Button block variant="secondary" className="m-0" onClick={() => this.get_image(this.props.type)}>{this.state.show ? "Hide " : "Show "}{this.props.text}</Button>
        <Overlay
          target={document.getElementById('root')}
          show={this.state.show}
        >
          {() => (popover)}
        </Overlay>
      </div>
      )

  }
}

export default ShowButon;