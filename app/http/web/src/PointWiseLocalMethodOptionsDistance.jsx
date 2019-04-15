import React from 'react';

import {Container, Row, Col, Form} from 'react-bootstrap';

function PointWiseLocalMethodOptionsDistance(props) {
  return (
      <Container className='m-0 p-0'>
        <Row noGutters className="ml-1">
          <Row noGutters className='mw-100 w-100'>
            <label>Method</label>
          </Row>
          
          <Form.Check className='mw-100 w-100'  type="radio" 
            name="distance_local_method" value="DTA6" 
            label="Parametric - DTA from Eq.(6)"
            onChange={(e) => props.form.onChange(e)}
            checked={props.form.distance_local_method === "DTA6"} />
          <Form.Check className='mw-100 w-100' type="radio" 
            name="distance_local_method" value="DTA5" 
            label="Parametric - DTA from Eq.(5)"
            onChange={(e) => props.form.onChange(e)}
            checked={props.form.distance_loacl_method === "DTA5"}/>
          
          <Form.Group as={Row} className='mw-100 w-100' noGutters>
            <Col sm="8">
              <Form.Check type="checkbox" name="surrogates" 
                label="Surrogats (number of samples)" 
                onChange={(e) => props.form.onChange(e)}
                value={props.form.surrogates}/>
            </Col>
            <Col sm="4">
              <Form.Control type="number" name="number_of_samples" 
                min="0" max="99.999" step="0.01"
                onChange={(e) => props.form.onChange(e)}
                value={props.form.number_of_samples} />
            </Col>
          </Form.Group>

        </Row>
        <Row noGutters className="ml-1">
          <Form.Group className='mw-100 w-100' as={Row} noGutters >
            <Form.Label column sm="8">Maximal probability PTH of type II error</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name="max_probability_of_PTH_error" 
                min="0" max="0.99" step="0.01"
                onChange={(e) => props.form.onChange(e)}
                value={props.form.max_probability_of_PTH_error} />
            </Col>
          </Form.Group>
          <Form.Group className='mw-100 w-100' as={Row} noGutters>
            <Form.Label column sm="8">Log(1-PTH)</Form.Label>
            <Col sm="4">
              <Form.Control disabled type="number" name="log_PTH" 
                max="0.99" step="0.01"
                onChange={(e) => props.form.onChange(e)}
                value={props.form.log_PTH} />
            </Col>
          </Form.Group>
          <Form.Group className='mw-100 w-100' as={Row} noGutters >
            <Form.Label column sm="8">Blur of surrogates</Form.Label>
            <Col sm="4">
              <Form.Control type="number" name="blur_of_surrogates" 
                min="0" max="0.99" step="0.01"
                onChange={(e) => props.form.onChange(e)}
                value={props.form.blur_of_surrogates} />
            </Col>
          </Form.Group>
        </Row>
      </Container>
    )
}

export default PointWiseLocalMethodOptionsDistance;