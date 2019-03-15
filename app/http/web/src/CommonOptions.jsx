import React from 'react';

import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import UploadingButton from './UploadingButton.jsx';

function CommonOptions(props) {
  return (
    <Container className="p-0 m-0 w-100 mw-100">
      <Row noGutters>{/*File Uploads*/}
        <Col sm="6">
          <Row noGutters className="ml-1">Planned dose file</Row>
          <div className="file-name ml-1">
            {props.uploadButtons[0].file && props.uploadButtons[0].file.name}
            {!props.uploadButtons[0].file && "No file selected."}
          </div>
          <UploadingButton options={props.uploadButtons[0]}
            type={0} 
            handeClickUploadButton={props.handeClickUploadButton}/> 
          
        </Col>
        <Col sm="6">
          <Row noGutters className="ml-1">Applied dose file</Row>
          <div className="file-name ml-1">
            {props.uploadButtons[1].file && props.uploadButtons[1].file.name}
            {!props.uploadButtons[1].file && "No file selected."}
          </div>
          <UploadingButton options={props.uploadButtons[1]}
            type={1}
            handeClickUploadButton={props.handeClickUploadButton}/>
        </Col>
      </Row>
      <Row noGutters >{/*Methods checkboxes*/}
        <div key={'inline-checkbox'} className="mb-3 mx-auto">
          <Form.Check inline label="Global-index method" type='checkbox' id={'inline-checkbox-1'} />
          <Form.Check inline label="Van Dyk method" type='checkbox' id={'inline-checkbox-2'} />
          <Form.Check inline label="Dose difference method" type='checkbox' id={'inline-checkbox-3'} />
        </div>
      </Row>
      <Row noGutters className='ml-1'> {/*Method's parameters*/}
        <Col>{/*Thereshold & Min & Max*/}
          <Form.Group as={Row} controlId="formThresholdGammaIndex">
            <Form.Label column sm="9">Threshold for Gamma index method</Form.Label>
            <Col sm="3">
              <Form.Control type="number" placeholder="0.00" min="0" max="99.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formMinimalValuesPercentage">
            <Form.Label column sm="9">Do not accout for percentage of minimal values</Form.Label>
            <Col sm="3">
              <Form.Control type="number" placeholder="0" min="0" max="30"/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formMaximalDistanceToBeProbed">
            <Form.Label column sm="9">Maximal distance to be probed for DTA [mm]</Form.Label>
            <Col sm="3">
              <Form.Control type="number" placeholder="0.00" min="0" max="99.99" step="0.01"/>
            </Col>
          </Form.Group> 
        </Col>
        <Col>{/* Linear Coefficients*/}
          <Row noGutters className='ml-1'>
            <label>Linear model for standard deviation of delivered dose: SD(Dose)=A+B*Dose</label>
          </Row>
          <Row noGutters>
            <Col>
              <Form.Group className='ml-1' as={Row} noGutters controlId="formLinearCoefficientA">
                <Form.Label column sm="2">A</Form.Label>
                <Col sm="10">
                  <Form.Control type="number" placeholder="0.00" min="0" max="99.99" step="0.01" />
                </Col>
              </Form.Group>
            </Col>
            <Col>
                <Form.Group className='ml-1' as={Row} noGutters controlId="formLinearCoefficientB">
                <Form.Label column sm="2">B</Form.Label>
                <Col sm="10">
                  <Form.Control inline="true" type="number" placeholder="0.00" min="0" max="99.99" step="0.01" />
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Col>        
      </Row>
      
    </Container>
    )
}

export default CommonOptions;