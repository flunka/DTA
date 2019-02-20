import React from 'react';
import {Nav} from 'react-bootstrap'

function Sidebar(argument) {
  return (
    <Nav defaultActiveKey="#" className="flex-column" id="sidebar">
      <Nav.Link href="#">Global method</Nav.Link>
      <Nav.Link eventKey="#">Clustering methods</Nav.Link>
      <Nav.Link eventKey="#">Point-wise local method</Nav.Link>
    </Nav>
    )
  
}

export default Sidebar