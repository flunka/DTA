import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function PointWiseLocalMethodOptionsDose(argument) {
  return (
      <Form.Group as={Row} noGutters controlId="formMaxProbabilityOfError">
        <Form.Label column sm="7">Maximal probability of type II error</Form.Label>
        <Col sm="5">
          <Form.Control type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
        </Col>
      </Form.Group>
    )
}

export default PointWiseLocalMethodOptionsDose;