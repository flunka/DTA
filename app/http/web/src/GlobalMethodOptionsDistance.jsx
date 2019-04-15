import React from 'react';

import {Col, Row, Form} from 'react-bootstrap';

function GlobalMethodOptionsDistance(props) {
  return (
      <Form.Group className="ml-1" as={Row} noGutters>
        <Form.Label column sm="9">Reference distence to agreement [mm]</Form.Label>
        <Col sm="3">
          <Form.Control type="number" name="reference_distance_to_agreement" 
            min="1" max="10" step="0.1"
            onChange={(e) => props.form.onChange(e)}
            value={props.form.reference_distance_to_agreement} />
        </Col>
      </Form.Group>
    )
}

export default GlobalMethodOptionsDistance;