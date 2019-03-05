import React from 'react';

import {Container, Row, Col, Form, Button} from 'react-bootstrap';

function CommonOptions(argument) {
  return (
    <Container className="p-0 m-0 w-100 mw-100">
      <Row noGutters>
        <Button variant="info" size="lg" type="submit" block>Run</Button>
      </Row>
      <Row noGutters>{/*File Uploads*/}
        <Col>
          <Form.Group controlId="formUploadPlannedDose">
            <Form.Label>Planned dose file</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          <Button variant="secondary"  block>Show Plan</Button>
        </Col>
        <Col>
          <Form.Group controlId="formUploadAppliedDose">
            <Form.Label>Applied dose file</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
          <Button variant="secondary" block>Show Realization</Button>
        </Col>
      </Row>
      <Row noGutters>{/*Methods checkboxes*/}
        <div key={'inline-checkbox'} className="mb-3 mx-auto">
          <Form.Check inline label="Global-index method" type='checkbox' id={'inline-checkbox-1'} />
          <Form.Check inline label="Van Dyk method" type='checkbox' id={'inline-checkbox-2'} />
          <Form.Check inline label="Dose difference method" type='checkbox' id={'inline-checkbox-3'} />
        </div>
      </Row>
      <Row noGutters>{/*Method's parameters*/}
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
          <Row noGutters>
            <label>Linear model for standard deviation of delivered dose: SD(Dose)=A+B*Dose</label>
          </Row>
          <Row noGutters>
            <Col>
              <Form.Group as={Row} noGutters controlId="formLinearCoefficientA">
                <Form.Label column sm="2">A</Form.Label>
                <Col sm="10">
                  <Form.Control type="number" placeholder="0.00" min="0" max="99.99" step="0.01" />
                </Col>
              </Form.Group>
            </Col>
            <Col>
                <Form.Group as={Row} noGutters controlId="formLinearCoefficientB">
                <Form.Label column sm="2">B</Form.Label>
                <Col sm="10">
                  <Form.Control inline="true" type="number" placeholder="0.00" min="0" max="99.99" step="0.01" />
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <Row noGutters>
            <Col>
              <Button variant="secondary" block>Adjust doses</Button>
            </Col>
            <Col>
              <Button variant="secondary" block>Align doses</Button>
            </Col>
          </Row>
        </Col>        
      </Row>
      
    </Container>
    )
}

export default CommonOptions;