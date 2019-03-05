import React from 'react';

import {Col, Row, Form} from 'react-bootstrap';

function GlobalMethodOptionsDistance(argument) {
  return (
      <Form.Group as={Row} controlId="formDistanceToAgreement" noGutters>
        <Form.Label column sm="9">Distance to agreement</Form.Label>
        <Col sm="3">
          <Form.Control type="number" placeholder="0.0" min="0" max="10" step="0.1" />
        </Col>
      </Form.Group>
    )
}

export default GlobalMethodOptionsDistance;