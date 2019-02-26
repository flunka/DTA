import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function GlobalMethodOptions(argument) {
  return (
      <Container className="p-0 m-0 w-100 mw-100">
        <Row noGutters>
          <Col>{/*MaximumDoseDiffrence*/}
            <Form.Group as={Row} controlId="formMaximumDoseDiffrence" noGutters>
              <Form.Label column sm="9">% of maximum dose diffrence</Form.Label>
              <Col sm="3">
                <Form.Control type="number" placeholder="0.00" min="0" max="20" step="0.01" />
              </Col>
            </Form.Group>
          </Col>
          <Col>{/*Distance to agreement*/}
            <Form.Group as={Row} controlId="formDistanceToAgreement" noGutters>
              <Form.Label column sm="9">Distance to agreement</Form.Label>
              <Col sm="3">
                <Form.Control type="number" placeholder="0.0" min="0" max="10" step="0.1" />
              </Col>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    )
}

export default GlobalMethodOptions;