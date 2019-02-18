import React from 'react';

import {Button} from 'react-bootstrap';

import styles from './App.css';

import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';

function App(argument) {
  return (
    <div className="Content">
      <Header />
      <Content />
      <Footer />
    </div>
    );
};

export default App