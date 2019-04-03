import React from 'react';

import {RingLoader} from 'react-spinners';
import styles from './App.css';

import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isConnected: false
    };
  }
  connect_with_backend(){
    fetch(process.env.API_URL, { // Your POST endpoint
      method: 'GET',
      credentials: "include"
    }).then(
      response => (response.json()) // if the response is a JSON object
    ).then(
      success => (
          this.setState({
            isConnected: true
          })
        )
    ).catch(
      error => (
          this.setState({
            isConnected: false
          })
        )
    );
  }
  componentDidMount() {
    this.connect_with_backend();
  }


  render(){    
    return (
      <div>      
      { this.state.isConnected &&
        <div className="Content w-100">
          <Header />      
          <Content />
          <Footer />
        </div>
      }
      {!this.state.isConnected && 
        <div className="Content w-100 h-100  d-flex justify-content-center align-self-stretch">
          <RingLoader/>
        </div>
      }
      </div>
    );
  }
  
};

export default App