import React from 'react';

import {Col, Row, Form} from 'react-bootstrap';

function GlobalMethodOptionsDose(argument) {
  return (
      <Form.Group className="ml-1" as={Row} controlId="formReferenceDoseTolerance" noGutters>
        <Form.Label column sm="9">Reference dose tolerance (% of maximal planned dose)</Form.Label>
        <Col sm="3">
          <Form.Control type="number" placeholder="0.00" min="0" max="20" step="0.01" />
        </Col>
      </Form.Group>
    )
}

export default GlobalMethodOptionsDose;