import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function ClusteringMethodOptionsDistance(props) {
  return (
    <Container className='m-0 p-0'>
      <Row noGutters className="ml-1">
        <label>Clustering method: K-means clustering</label>
      </Row>
      <Row noGutters className="ml-1">
        <Form.Group as={Row} className='mw-100 w-100' noGutters>
          <Form.Label column sm="8">Low gradient tolerance [mm]</Form.Label>
          <Col sm="4">
            <Form.Control type="number" name="low_gradient_tolerance" 
              min="1" max="99.999" step="1"
              onChange={(e) => props.form.onChange(e)}
              value={props.form.low_gradient_tolerance} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className='mw-100 w-100' noGutters>
          <Form.Label column sm="8">High gradient tolerance [mm]</Form.Label>
          <Col sm="4">
            <Form.Control type="number" name="high_gradient_tolerance" 
              min="1" max="99.999" step="1" 
              onChange={(e) => props.form.onChange(e)}
              value={props.form.high_gradient_tolerance}/>
          </Col>
        </Form.Group>
      </Row>
    </Container>
    )
}

export default ClusteringMethodOptionsDistance;