import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function ClusteringMethodOptionsDose(props) {
  return (
      <Container className='ml-1 p-0'>
        <Row noGutters>
          <label>Clustering method: K-means clustering</label>
        </Row>
        <Row noGutters className='justify-content-end'>
          <Form.Group as={Row} className='mw-100 w-100'  noGutters>
            <Col sm="8">
            <Form.Label>% of variance explained</Form.Label>
            </Col>
            <Col sm="4">
              <Form.Control type="number" name="variance_explained" min="0" 
                max="99.999" step="1"
                onChange={(e) => props.form.onChange(e)}
                value={props.form.variance_explained} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mw-100 w-100' noGutters>
            <Col sm="8">
              <Form.Check type="checkbox" label="Use manually set number of clusters" name="clusters_manually"
                onChange={(e) => props.form.onChange(e)}
                checked={props.form.clusters_manually} />
            </Col>
            <Col sm="4">
              <Form.Control type="number" name="number_of_clusters" 
                min="1" max="99"
                onChange={(e) => props.form.onChange(e)}
                value={props.form.number_of_clusters}
                disabled={!props.form.clusters_manually}  />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mw-100 w-100' noGutters>
            <Form.Label column sm="8">Maximal probability of type II error</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name="max_probability_of_error" 
                min="0" max="0.99" step="1"
                onChange={(e) => props.form.onChange(e)}
                value={props.form.max_probability_of_error} />
            </Col>
          </Form.Group>
        </Row>
      </Container>
      
    )
}

export default ClusteringMethodOptionsDose;