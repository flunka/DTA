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


  render(){
    return (
      <Col id="Content" sm={9}>
          <CommonOptions 
          handleSelectedFile={this.props.handleSelectedFile}
          uploadButtons={this.props.uploadButtons}
          form={this.props.form} />
          <Row noGutters>
            <Col>
            <Alert variant='dark' className='m-0 p-0 text-center'>Dose quality assessment</Alert>
              { this.props.sidebar[0].methodToRender === 'global' && 
                <GlobalMethodOptionsDose
                  form={this.props.form} />}
              { this.props.sidebar[0].methodToRender === 'clustering' && 
                <ClusteringMethodOptionsDose
                  form={this.props.form} />}
              { this.props.sidebar[0].methodToRender === 'local' && 
                <div />}
            </Col>
            <Col>
            <Alert variant='dark' className='m-0 p-0 text-center'>Distance to agreement assessment</Alert>
              { this.props.sidebar[1].methodToRender === 'global' && 
                <GlobalMethodOptionsDistance 
                  form={this.props.form}/>}
              { this.props.sidebar[1].methodToRender === 'clustering' && 
                <ClusteringMethodOptionsDistance 
                  form={this.props.form}/>}
              { this.props.sidebar[1].methodToRender === 'local' && 
                <div/>}
            </Col>
          </Row>
      </Col>
    );
  }
}

export default MainPanel;