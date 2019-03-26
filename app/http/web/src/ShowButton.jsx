import React from 'react';

import {Button, Popover, Overlay, Image, Alert} from 'react-bootstrap';
import {Rnd} from 'react-rnd';
import download from './download.png'


class ShowButon extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      url: "",
      show: false,
      x: 0,
      y: 0
    };

    this.get_image = this.get_image.bind(this);
  }

  get_image(type){
    fetch(process.env.API_URL + '/GetImage?type=' + type , { // Your POST endpoint
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
    const resizing = { top:false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }
    const popover = (
        <Rnd 
          style={{zIndex:this.props.zIndex}}
          default={{
            x: this.state.x,
            y: this.state.y,
            width: 650,
          }}
          minWidth={250}
          maxWidth={1200}
          lockAspectRatio={true}
          enableResizing={resizing}
          onDragStop={(e, data) => {
            this.setState({
              x: data.x,
              y: data.y
            })
          }}
          onClick={this.props.imageOnClick}
        >
          <Alert variant="secondary" className="m-0 p-0 text-center"
            onDoubleClick={() => {this.setState({show:false})}}
          >
            {this.props.text} image 
            <a href={this.state.url} download>
              <img src={download} alt='download' 
                width="30" height="30">
              </img>
            </a>
          </Alert>
          <img className="image" src={this.state.url} />
        </Rnd>        
    );
    return(
      <div>
        <Button block variant="secondary" disabled={this.props.disable} className="m-0" onClick={() => {
          this.state.show ? this.setState({show: false}) : 
          this.get_image(this.props.type)}
          }
        >
          {this.state.show ? "Hide " : "Show "}{this.props.text}</Button>
        <Overlay
          container={document.getElementById('root')}
          show={this.state.show}
        >
          {() => (popover)}
        </Overlay>
      </div>
      )

  }
}

export default ShowButon;