import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function ClusteringMethodOptionsDose(argument) {
  return (
      <Container className='ml-1 p-0'>
        <Row noGutters>
          <label>Clustering method</label>
          <Form.Check type="radio" name="dose_method" value="gaussian" label="Gaussian mixture"/>
          <Form.Check type="radio" name="dose_method" value="k-means" label="K-means clustering"/>
        </Row>
        <Row noGutters className='justify-content-end'>
          <Form.Group as={Row} className='mw-100 w-100'  noGutters>
            <Col sm="8">
            <Form.Label>% of variance explained</Form.Label>
            </Col>
            <Col sm="4">
              <Form.Control type="number" name="variance_explained"  defaultValue="0.000" min="0" max="99.999" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mw-100 w-100' noGutters>
            <Col sm="8">
              <Form.Check type="checkbox" label="Use manually set number of clusters" name="clusters_manually" />
            </Col>
            <Col sm="4">
              <Form.Control type="number" name="number_of_clusters" defaultValue="0" min="0" max="99" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mw-100 w-100' noGutters>
            <Form.Label column sm="8">Maximal probability of type II error</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name="max_probability_of_error" defaultValue="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
        </Row>
      </Container>
      
    )
}

export default ClusteringMethodOptionsDose;