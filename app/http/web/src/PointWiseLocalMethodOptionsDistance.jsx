import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function PointWiseLocalMethodOptionsDistance(argument) {
  return (
      <Container className='m-0 p-0'>
        <Row noGutters>
          <Row noGutters className='mw-100 w-100'>
            <label>Method</label>
          </Row>
          
          <Form.Check className='mw-100 w-100'  type="radio" name="method" label="Parametric - DTA from Eq.(6)" id="DTA-6-radio" />
          <Form.Check className='mw-100 w-100' type="radio" name="method" label="Parametric - DTA from Eq.(5)" id="DTA-5-radio" />
          
          <Form.Group as={Row} className='mw-100 w-100' noGutters controlId="formVarianceExplained">
            <Col sm="8">
              <Form.Check type="radio" name="method" label="Surrogats (number of samples)" id="surrogates-radio" />
            </Col>
            <Col sm="4">
              <Form.Control type="number" placeholder="0.000" min="0" max="99.999" step="0.01" />
            </Col>
          </Form.Group>

        </Row>
        <Row noGutters>
          <Form.Group className='mw-100 w-100' as={Row} noGutters controlId="formMaxProbabilityPTHOfError">
            <Form.Label column sm="8">Maximal probability PTH of type II error</Form.Label>
            <Col sm="4">
              <Form.Control type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group className='mw-100 w-100' as={Row} noGutters controlId="formLogPTH">
            <Form.Label column sm="8">Log(1-PTH)</Form.Label>
            <Col sm="4">
              <Form.Control disabled type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group className='mw-100 w-100' as={Row} noGutters controlId="formBlurOfSurrogates">
            <Form.Label column sm="8">Blur of surogates</Form.Label>
            <Col sm="4">
              <Form.Control type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
        </Row>
      </Container>
    )
}

export default PointWiseLocalMethodOptionsDistance;