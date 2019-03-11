import React from 'react';
import {Button} from 'react-bootstrap'


class UploadingButton extends React.Component{
  constructor(props){
    super(props);
  }



  render(){
    return(
      <Button 
        varinat='primary'
        disabled={this.props.options.isLoading || this.props.options.isLoaded || !this.props.options.file}
        onClick={!(this.props.options.isLoading || this.props.options.isLoaded) 
          ?(e) => this.props.handeClickUploadButton(this.props.type) : null}
      >
      {this.props.options.isLoading == this.props.options.isLoaded && 'Upload'}
      {this.props.options.isLoading && 'Uploading...'}
      {this.props.options.isLoaded && 'Uploaded!'}
      </Button>
      )
    
  }

}

export default UploadingButton