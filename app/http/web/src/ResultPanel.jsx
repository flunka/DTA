import React from 'react';

class ResultPanel extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>Results:<br/>
      Gamma-index method: {this.props.results.gamma === "" && <a>not completed!</a>}
      {this.props.results.gamma != "" && <a>Passing rate = {this.props.results.gamma_passing_rate}%</a>}<br/>
      Dose difference method: {this.props.results.dose_diff === "" && <a>not completed!</a>}
      {this.props.results.dose_diff != "" && <a>Passing rate = {this.props.results.dose_diff_passing_rate}%</a>}<br/>
      Van Dyk method: {this.props.results.van_dyk === "" && <a>not completed!</a>}
      {this.props.results.van_dyk != "" && <a>Passing rate = {this.props.results.van_dyk_passing_rate}%</a>}
      </div>
      )
  }
}

export default ResultPanel