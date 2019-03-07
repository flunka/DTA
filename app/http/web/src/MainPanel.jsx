import React from 'react';

import {Alert, Col, Row, Form} from 'react-bootstrap';
import {RingLoader} from 'react-spinners';

import CommonOptions from './CommonOptions.jsx';
import GlobalMethodOptionsDose from './GlobalMethodOptionsDose.jsx';
import GlobalMethodOptionsDistance from './GlobalMethodOptionsDistance.jsx';
import ClusteringMethodOptionsDose from './ClusteringMethodOptionsDose.jsx';
import ClusteringMethodOptionsDistance from './ClusteringMethodOptionsDistance.jsx';
import PointWiseLocalMethodOptionsDose from './PointWiseLocalMethodOptionsDose.jsx';
import PointWiseLocalMethodOptionsDistance from './PointWiseLocalMethodOptionsDistance.jsx';


class MainPanel extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      data: null,
      loading: false,
    };
  }

  
  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);
    
    this.setState({loading: true});
    fetch('http://localhost:5000/', {
          method: 'POST',
          body: data,
        })
      .then(response => response.json())
      .then(data => this.setState({ 
        data: data,
        loading: false
        }))
      .catch(error => console.log(error));
    console.log(this.state.data);
  }

  render(){
    return (
      <Col id="Content" sm={9}>
        {this.state.loading ?
        (<div className='d-flex align-items-center '><RingLoader className='align-self-center'
          loading={this.state.loading}
        /></div>) :
        (<Form onSubmit={e => this.handleSubmit(e)}>
          <CommonOptions 
          handleSelectedFile={this.props.handleSelectedFile}
          uploadButtons={this.props.uploadButtons}
          handeClickUploadButton={this.props.handeClickUploadButton} />
          <Row noGutters>
            <Col>
            <Alert variant='dark' className='m-0 p-0 text-center'>Dose quality assessment</Alert>
              { this.props.doseMethodToRender === 0 && 
                <GlobalMethodOptionsDose />}
              { this.props.doseMethodToRender === 1 && 
                <ClusteringMethodOptionsDose />}
              { this.props.doseMethodToRender === 2 && 
                <PointWiseLocalMethodOptionsDose />}
            </Col>
            <Col>
            <Alert variant='dark' className='m-0 p-0 text-center'>Distance to agreement assessment</Alert>
              { this.props.distanceMethodToRender === 0 && 
                <GlobalMethodOptionsDistance />}
              { this.props.distanceMethodToRender === 1 && 
                <ClusteringMethodOptionsDistance />}
              { this.props.distanceMethodToRender === 2 && 
                <PointWiseLocalMethodOptionsDistance />}
            </Col>
          </Row>
        </Form>)
        }
      </Col>
    );
  }
}

export default MainPanel;