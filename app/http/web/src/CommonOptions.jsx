import React from 'react';

import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import UploadingButton from './UploadingButton.jsx';

class CommonOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dose_diff:false
    }
  }

  dose_diffOnClick(){
    this.setState({dose_diff: !this.state.dose_diff});
  }

  render(){
    return (
      <Container className="p-0 m-0 w-100 mw-100">
        <Row noGutters>{/*File Uploads*/}
          <Col sm="6">
            <Row noGutters className="ml-1">Planned dose file</Row>
            <div className="file-name ml-1">
              {this.props.uploadButtons[0].file && this.props.uploadButtons[0].file.name}
              {!this.props.uploadButtons[0].file && "No file selected."}
            </div>
            <UploadingButton options={this.props.uploadButtons[0]}
              type={0} /> 
            
          </Col>
          <Col sm="6">
            <Row noGutters className="ml-1">Applied dose file</Row>
            <div className="file-name ml-1">
              {this.props.uploadButtons[1].file && this.props.uploadButtons[1].file.name}
              {!this.props.uploadButtons[1].file && "No file selected."}
            </div>
            <UploadingButton options={this.props.uploadButtons[1]}
              type={1}/>
          </Col>
        </Row>
        <Row noGutters >{/*Methods checkboxes*/}
          <div className="mb-3 mx-auto">
            <Form.Check inline label="Gamma-index method" name="gamma"
              type='checkbox' defaultChecked />          
            <Form.Check inline label="Dose difference method" type='checkbox' name="dose_diff"
            onClick={() => this.dose_diffOnClick()} /> 
            <Form.Check inline label="Van Dyk method" type='checkbox' name="van_dyk" disabled={!this.state.dose_diff} />
          </div>
        </Row>
        <Row noGutters className='ml-1'> {/*Method's parameters*/}
          <Col>{/*Thereshold & Min & Max*/}
            <Form.Group as={Row}>
              <Form.Label column sm="9">Do not accout for percentage of minimal values</Form.Label>
              <Col sm="3">
                <Form.Control name="min_percentage" type="number" defaultValue={0.1} 
                  defaultValue="0" min="0" step="0.1" max="30"/>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="9">Plan resolution [mm]</Form.Label>
              <Col sm="3">
                <Form.Control type="number" name="plan_resolution"
                  defaultValue="1.00" min="0" max="99.99" step="0.01"/>
              </Col>
            </Form.Group> 
          </Col>
          <Col>{/* Linear Coefficients*/}
            <Row noGutters className='ml-1'>
              <label>Linear model for standard deviation of delivered dose: SD(Dose)=A*Dose</label>
            </Row>
            <Row noGutters>
              <Col>
                <Form.Group className='ml-1' as={Row} noGutters>
                  <Form.Label column sm="2">A</Form.Label>
                  <Col sm="10">
                    <Form.Control type="number" name="coefficient_a"
                      defaultValue="0.1" min="0" max="99.99" step="0.01" />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Col>        
        </Row>
        
      </Container>
    )


  }
}

export default CommonOptions;