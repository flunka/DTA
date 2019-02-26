import React from 'react';

import {Col, Form} from 'react-bootstrap';

import CommonOptions from './CommonOptions.jsx';
import GlobalMethodOptions from './GlobalMethodOptions.jsx';
import ClusteringMethodOptions from './ClusteringMethodOptions.jsx';
import PointWiseLocalMethodOptions from './PointWiseLocalMethodOptions.jsx';


function MainPanel(props) {
  return (
    <Col id="Content" sm={9}>
      <Form>
        <CommonOptions />
        { props.toRender === 0 && <GlobalMethodOptions />}
        { props.toRender === 1 && <ClusteringMethodOptions />}
        { props.toRender === 2 && <PointWiseLocalMethodOptions />}
      </Form>
    </Col>
  );
}

export default MainPanel;