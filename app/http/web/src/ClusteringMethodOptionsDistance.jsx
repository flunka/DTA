import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function ClusteringMethodOptionsDistance(argument) {
  return (
    <Container className='m-0 p-0'>
      <Row noGutters className="ml-1">
        <label>Clustering method</label>
        <Form.Check type="radio" name="method" label="Gaussian mixture" id="gaussian-radio" />
        <Form.Check type="radio" name="method" label="K-means clustering" id="k-means-radio" />
      </Row>
      <Row noGutters className="ml-1">
        <Form.Group as={Row} className='mw-100 w-100' noGutters controlId="formSuggestedTolerance">
          <Col sm="8">
            <Form.Check type="checkbox" label="Sugest tolerance at prob. level" id="sugested-tolerance" />
          </Col>
          <Col sm="4">
            <Form.Control type="number" placeholder="0" min="0" max="1" step="0.1" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters controlId="formLowGradientTolerance">
          <Form.Label column sm="8">Low gradient tolerance [mm]</Form.Label>
          <Col sm="4">
            <Form.Control type="number" placeholder="0.000" min="0" max="99.999" step="0.01" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters controlId="formHighGradientTolerance">
          <Form.Label column sm="8">High gradient tolerance [mm]</Form.Label>
          <Col sm="4">
            <Form.Control type="number" placeholder="0.000" min="0" max="99.999" step="0.01" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters controlId="formNumberOfSurrogates">
          <Form.Label column sm="8">Number of surrogates</Form.Label>
          <Col sm="4">
            <Form.Control type="number" placeholder="0" min="0" max="99" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters controlId="formBlurOfSurrogates">
          <Form.Label column sm="8">Blur of surrogates</Form.Label>
          <Col sm="4">
            <Form.Control type="number" placeholder="0.00" min="0" max="5" step="0.01" />
          </Col>
        </Form.Group>
      </Row>
    </Container>
    )
}

export default ClusteringMethodOptionsDistance;