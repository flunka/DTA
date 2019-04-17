import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function PointWiseLocalMethodOptionsDose(props) {
  return (
    <Row noGutters>
      <Form.Group className="ml-1" as={Row} noGutters>
        <Form.Label column sm="7">Maximal probability of type II error</Form.Label>
        <Col sm="5">
          <Form.Control type="number" name="max_probalility" 
            min="0" max="0.99" step="1"
            onChange={(e) => props.form.onChange(e)}
            value={props.form.max_probalility}/>
        </Col>
      </Form.Group>
      <Col>{/* Linear Coefficients*/}
        <Row noGutters className='ml-1'>
          <label>Linear model for standard deviation of delivered dose: SD(Dose)=A*Dose</label>
        </Row>
        <Row noGutters>
          <Col>
            <Form.Group className='ml-1' as={Row} noGutters>
              <Form.Label column sm="7">A</Form.Label>
              <Col sm="5">
                <Form.Control type="number" name="coefficient_a"
                  min="0" max="99.99" step="1"
                  onChange={(e) => props.form.onChange(e)}
                  value={props.form.coefficient_a} />
              </Col>
            </Form.Group>
          </Col>
        </Row>
      </Col> 
    </Row>
    )
}

export default PointWiseLocalMethodOptionsDose;