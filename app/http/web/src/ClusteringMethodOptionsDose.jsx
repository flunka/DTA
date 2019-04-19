import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function ClusteringMethodOptionsDose(props) {
  return (
      <Container className='ml-1 p-0'>
        <Row noGutters>
          <label>Clustering method: K-means clustering</label>
        </Row>
        <Row noGutters className='justify-content-end'>
          <Form.Group as={Row} className='mw-100 w-100' noGutters>
            <Form.Label column sm="8">Number of clusters</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name="number_of_clusters" 
                min="1" max="6"
                onChange={(e) => props.form.number_of_clustersOnChange(e)}
                value={props.form.number_of_clusters} />
            </Col>
          </Form.Group>
          {props.form.clustering_dose_tolerance.map((clustering_dose_tolerance, idx) => (
          <Form.Group as={Row} className='mw-100 w-100' noGutters key={idx}>
            <Form.Label column sm="8">Tolerance for cluster number {idx+1}</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name={"clustering_dose_tolerance_" + idx}
                  min="1" max="100"
                  onChange={(e) => props.form.clustering_dose_toleranceOnChange(e,idx)}
                  value={clustering_dose_tolerance.value}
                  />
            </Col>
          </Form.Group>
        ))}
        </Row>
      </Container>
      
    )
}

export default ClusteringMethodOptionsDose;