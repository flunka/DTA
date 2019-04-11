import React from 'react';

import {Col, Row, Form} from 'react-bootstrap';

function GlobalMethodOptionsDistance(argument) {
  return (
      <Form.Group className="ml-1" as={Row} noGutters>
        <Form.Label column sm="9">Reference distence to agreement [mm]</Form.Label>
        <Col sm="3">
          <Form.Control type="number" name="reference_distance_to_agreement" 
            defaultValue="0.0" min="0" max="10" step="0.1" />
        </Col>
      </Form.Group>
    )
}

export default GlobalMethodOptionsDistance;