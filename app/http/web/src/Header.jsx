import React from 'react';
import {Navbar} from 'react-bootstrap'
import logo from './logo.png'

function Header(argument) {
  return (
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home">
      <img
        alt="logo"
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />
      {' DTA App | v1.0'}
    </Navbar.Brand>
  </Navbar>
    )
}

export default Header 