import React from 'react';

import {Col, Row, Form} from 'react-bootstrap';

function GlobalMethodOptionsDose(props) {
  return (
      <Form.Group className="ml-1" as={Row} noGutters>
        <Form.Label column sm="9">Reference dose tolerance (% of maximal planned dose)</Form.Label>
        <Col sm="3">
          <Form.Control type="number" name="maximum_dose_difference"
            min="0" max="20" step="1"
            onChange={(e) => props.form.onChange(e)}
            value={props.form.maximum_dose_difference} />
        </Col>
      </Form.Group>
    )
}

export default GlobalMethodOptionsDose;