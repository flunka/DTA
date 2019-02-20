import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';


import Sidebar from './Sidebar.jsx';



function Content(argument) {
  return (
    <Container className="p-0 m-0 w-100 mw-100" fulid>
      <Row noGutters>
        <Col sm={3}>
        <Sidebar />
        </Col>
        <Col id="Content" sm={9}>
          <p>Content</p>
        </Col>
      </Row>
    </Container>
    )
}

export default Content