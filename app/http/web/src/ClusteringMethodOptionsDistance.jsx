import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function ClusteringMethodOptionsDistance(argument) {
  return (
    <Container className='m-0 p-0'>
      <Row noGutters className="ml-1">
        <label>Clustering method</label>
        <Form.Check type="radio" name="distance_method" value="gaussian" label="Gaussian mixture" />
        <Form.Check type="radio" name="distance_method" value="k-menas" label="K-means clustering" />
      </Row>
      <Row noGutters className="ml-1">
        <Form.Group as={Row} className='mw-100 w-100' noGutters >
          <Col sm="8">
            <Form.Check type="checkbox" name="is_sugested" label="Sugest tolerance at prob. level" id="sugested-tolerance" />
          </Col>
          <Col sm="4">
            <Form.Control type="number" name="sugested_tolerance" defaultValue="0" min="0" max="1" step="0.1" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters>
          <Form.Label column sm="8">Low gradient tolerance [mm]</Form.Label>
          <Col sm="4">
            <Form.Control type="number" name="low_gradient_tolerance" defaultValue="0" min="0" max="99.999" step="0.01" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters>
          <Form.Label column sm="8">High gradient tolerance [mm]</Form.Label>
          <Col sm="4">
            <Form.Control type="number" name="high_gradient_tolerance" defaultValue="0.000" min="0" max="99.999" step="0.01" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters >
          <Form.Label column sm="8">Number of surrogates</Form.Label>
          <Col sm="4">
            <Form.Control type="number" name="number_of_surrogates" defaultValue="0" min="0" max="99" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters controlId="formBlurOfSurrogates">
          <Form.Label column sm="8">Blur of surrogates</Form.Label>
          <Col sm="4">
            <Form.Control type="number" name="blur_of_surrogates" defaultValue="0.00" min="0" max="5" step="0.01" />
          </Col>
        </Form.Group>
      </Row>
    </Container>
    )
}

export default ClusteringMethodOptionsDistance;