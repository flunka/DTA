import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function PointWiseLocalMethodOptions(argument) {
  return (
      <Row noGutters>
        <Col>
          <label>Method</label>
          <Form.Check type="radio" name="method" label="Parametric - DTA from Eq.(6)" id="DTA-6-radio" />
          <Form.Check type="radio" name="method" label="Parametric - DTA from Eq.(5)" id="DTA-5-radio" />
          
          <Form.Group as={Row} noGutters controlId="formVarianceExplained">
            <Form.Check type="radio" name="method" label="Surrogats (number of samples)" id="surrogates-radio" />
            <Col sm="5">
              <Form.Control type="number" placeholder="0.000" min="0" max="99.999" step="0.01" />
            </Col>
          </Form.Group>

        </Col>
        <Col>
          <Form.Group as={Row} noGutters controlId="formMaxProbabilityOfError">
            <Form.Label column sm="7">Maximal probability of type II error</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formMaxProbabilityPTHOfError">
            <Form.Label column sm="7">Maximal probability PTH of type II error</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formLogPTH">
            <Form.Label column sm="7">Log(1-PTH)</Form.Label>
            <Col sm="5">
              <Form.Control disabled type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formBlurOfSurrogates">
            <Form.Label column sm="7">Blur of surogates</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
        </Col>
      </Row>
    )
}

export default PointWiseLocalMethodOptions;