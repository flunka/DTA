import React from 'react';
import {Button} from 'react-bootstrap'


class UploadingButton extends React.Component{
  constructor(props){
    super(props);
  }



  render(){
    return(
      <Button 
        variant={this.props.options.variant}
        disabled={true}
        block
      >
      {this.props.options.isLoading == this.props.options.isLoaded && 'Not uploaded'}
      {this.props.options.isLoading && 'Uploading...'}
      {this.props.options.isLoaded && 'Uploaded!'}
      </Button>
      )
    
  }

}

export default UploadingButton