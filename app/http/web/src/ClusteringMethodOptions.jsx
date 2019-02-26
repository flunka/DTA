import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function ClusteringMethodOptions(argument) {
  return (
      <Row noGutters>
        <Col>
          <label>Clustering method</label>
          <Form.Check type="radio" name="method" label="Gaussian mixture" id="gaussian-radio" />
          <Form.Check type="radio" name="method" label="K-means clustering" id="k-means-radio" />
        </Col>
        <Col>
          <Form.Group as={Row} noGutters controlId="formVarianceExplained">
            <Form.Label column sm="7">% of variance explained</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.000" min="0" max="99.999" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formNumberOfClusters">
            <Col sm="7">
              <Form.Check type="checkbox" label="Use manually set number of clusters" id="use-manually-set-clusters" />
            </Col>
            <Col sm="5">
              <Form.Control type="number" placeholder="0" min="0" max="99" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formMaxProbabilityOfError">
            <Form.Label column sm="7">Maximal probability of type II error</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.00" min="0" max="0.99" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formSuggestedTolerance">
            <Col sm="7">
              <Form.Check type="checkbox" label="Sugest tolerance at prob. level" id="sugested-tolerance" />
            </Col>
            <Col sm="5">
              <Form.Control type="number" placeholder="0" min="0" max="1" step="0.1" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formLowGradientTolerance">
            <Form.Label column sm="7">Low gradient tolerance [mm]</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.000" min="0" max="99.999" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formHighGradientTolerance">
            <Form.Label column sm="7">High gradient tolerance [mm]</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.000" min="0" max="99.999" step="0.01" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formNumberOfSurrogates">
            <Form.Label column sm="7">Number of surrogates</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0" min="0" max="99" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} noGutters controlId="formBlurOfSurrogates">
            <Form.Label column sm="7">Blur of surrogates</Form.Label>
            <Col sm="5">
              <Form.Control type="number" placeholder="0.00" min="0" max="5" step="0.01" />
            </Col>
          </Form.Group>
        </Col>
      </Row>
    )
}

export default ClusteringMethodOptions;