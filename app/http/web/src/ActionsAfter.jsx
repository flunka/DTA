import React from 'react';

import {Button} from 'react-bootstrap'

import ShowButton from './ShowButton.jsx';

class ActionsAfter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      images: Array(3).fill({
        z: 0
      })
    }
  }


  imageOnClick(num){
    var images = this.state.images.slice();
    for (var i = 0, len = images.length; i < len; i++) {
      if (images[i].z > 0) {
        images[i].z = images[i].z- 1;  
      }      
    }
    images[num] = {
      z: 5
    };
    this.setState({
      images: images
    })
  }

  render(){
    return(
      <div>
        <Button className="m-0" 
          variant='secondary' 
          block
          onClick={() => this.props.results.reset()}>
          Back to start
        </Button>
        {this.props.results.gamma != "" && 
          <ShowButton text="Gamma-index"
          zIndex={this.state.images[0].z}
          imageOnClick={()=> this.imageOnClick(0)}
          type='gamma'
          disabled={false} />
        }
        {this.props.results.dose_diff != "" && 
          <ShowButton text="Dose diffrence"
          zIndex={this.state.images[0].z}
          imageOnClick={()=> this.imageOnClick(0)}
          type='dose_diff'
          disabled={false} />
        }
        {this.props.results.van_dyk != "" && 
          <ShowButton text="Van Dyk"
          zIndex={this.state.images[0].z}
          imageOnClick={()=> this.imageOnClick(0)}
          type='van_dyk'
          disabled={false} />
        }
      </div>
      )
  }
}

export default ActionsAfter