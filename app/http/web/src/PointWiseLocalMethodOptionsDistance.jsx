import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function PointWiseLocalMethodOptionsDistance(argument) {
  return (
      <Container className='m-0 p-0'>
        <Row noGutters className="ml-1">
          <Row noGutters className='mw-100 w-100'>
            <label>Method</label>
          </Row>
          
          <Form.Check className='mw-100 w-100'  type="radio" name="distance_method" value="DTA6" label="Parametric - DTA from Eq.(6)" />
          <Form.Check className='mw-100 w-100' type="radio" name="distance_method" value="DTA5" label="Parametric - DTA from Eq.(5)"/>
          
          <Form.Group as={Row} className='mw-100 w-100' noGutters>
            <Col sm="8">
              <Form.Check type="radio" name="surrogates" label="Surrogats (number of samples)" id="surrogates-radio" />
            </Col>
            <Col sm="4">
              <Form.Control type="number" name="number_of_samples" defaultValue="0.000" min="0" max="99.999" step="0.01" />
            </Col>
          </Form.Group>

        </Row>
        <Row noGutters className="ml-1">
          <Form.Group className='mw-100 w-100' as={Row} noGutters >
            <Form.Label column sm="8">Maximal probability PTH of type II error</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name="max_probability_of_PTH_error" defaultValue="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group className='mw-100 w-100' as={Row} noGutters>
            <Form.Label column sm="8">Log(1-PTH)</Form.Label>
            <Col sm="4">
              <Form.Control disabled type="number" name="log_PTH" defaultValue="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group className='mw-100 w-100' as={Row} noGutters >
            <Form.Label column sm="8">Blur of surrogates</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name="blur_of_surrogates" defaultValue="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
        </Row>
      </Container>
    )
}

export default PointWiseLocalMethodOptionsDistance;