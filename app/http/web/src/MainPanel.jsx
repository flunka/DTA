import React from 'react';

import {Col, Form} from 'react-bootstrap';
import {RingLoader} from 'react-spinners';

import CommonOptions from './CommonOptions.jsx';
import GlobalMethodOptions from './GlobalMethodOptions.jsx';
import ClusteringMethodOptions from './ClusteringMethodOptions.jsx';
import PointWiseLocalMethodOptions from './PointWiseLocalMethodOptions.jsx';


class MainPanel extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      data: null,
      loading: false,
    };
  }

  
  handleSubmit(event){
    event.preventDefault();
    const data = new FormData(event.target);
    
    this.setState({loading: true});
    fetch('http://localhost:5000/', {
          method: 'POST',
          body: data,
        })
      .then(response => response.json())
      .then(data => this.setState({ 
        data: data,
        loading: false
        }))
      .catch(error => console.log(error));
    console.log(this.state.data);
  }

  render(){
    return (
      <Col id="Content" sm={9}>
        {this.state.loading ?
        (<div className='d-flex align-items-center '><RingLoader className='align-self-center'
          loading={this.state.loading}
        /></div>) :
        (<Form onSubmit={e => this.handleSubmit(e)}>
          <CommonOptions />
          { this.props.toRender === 0 && <GlobalMethodOptions />}
          { this.props.toRender === 1 && <ClusteringMethodOptions />}
          { this.props.toRender === 2 && <PointWiseLocalMethodOptions />}
        </Form>)
        }
      </Col>
    );
  }
}

export default MainPanel;