import React from 'react';

import {Button, Popover, OverlayTrigger, Image} from 'react-bootstrap';

class ShowButon extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      url: ""
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
            url: success.image
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
      <Popover className="mw-100" id="popover-basic" >
        <Image src={this.state.url} />
      </Popover>
    );
    return(
        <OverlayTrigger trigger="click" placement="right" overlay={popover}>
          <Button block variant="secondary" className="m-0" onClick={() => this.get_image(this.props.type)}>{this.props.text}</Button>
        </OverlayTrigger>
      )

  }
}

export default ShowButon;