import React from 'react';

class ResultPanel extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>Results:<br/>
      Gamma-index method: {this.props.results.gamma === "" && <a>not </a>}completed!<br/>
      Dose difference method: {this.props.results.dose_diff === "" && <a>not </a>}completed!<br/>
      Van Dyk method: {this.props.results.van_dyk === "" && <a>not </a>}completed!
      </div>
      )
  }
}

export default ResultPanel