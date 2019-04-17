import React from 'react';

import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import UploadingButton from './UploadingButton.jsx';

class CommonOptions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dose_diff:false,
      relative:false
    }
  }

  dose_diffOnClick(){
    this.setState({dose_diff: !this.state.dose_diff});
  }
  relativeOnChange(){
    this.setState({relative:!this.state.relative});
  }

  render(){
    return (
      <Container className="p-0 m-0 w-100 mw-100">
        <Row noGutters>{/*File Uploads*/}
          <Col sm="6">
            <Row noGutters className="ml-1">Planned dose file</Row>
            <div className="file-name ml-1">
              {this.props.uploadButtons[0].file && this.props.uploadButtons[0].file.name}
              {!this.props.uploadButtons[0].file && "No file selected."}
            </div>
            <UploadingButton options={this.props.uploadButtons[0]}
              type={0} /> 
            
          </Col>
          <Col sm="6">
            <Row noGutters className="ml-1">Applied dose file</Row>
            <div className="file-name ml-1">
              {this.props.uploadButtons[1].file && this.props.uploadButtons[1].file.name}
              {!this.props.uploadButtons[1].file && "No file selected."}
            </div>
            <UploadingButton options={this.props.uploadButtons[1]}
              type={1}/>
          </Col>
        </Row>
        <Row noGutters >{/*Methods checkboxes*/}
          <div className="mb-3 mx-auto">
            <Form.Check inline label="Gamma-index method" name="gamma"
              type='checkbox'
              onChange={(e) => this.props.form.onChange(e)}
              checked={this.props.form.gamma} />          
            <Form.Check inline label="Dose difference method" type='checkbox' 
              name="dose_diff"
              onChange={(e) => this.props.form.dose_diffOnChange(e)}
              checked={this.props.form.dose_diff}
              /> 
            <Form.Check inline label="Van Dyk method" type='checkbox' name="van_dyk" disabled={!this.props.form.dose_diff}
              onChange={(e) => this.props.form.onChange(e)}
              checked={this.props.form.van_dyk}  />
          </div>
        </Row>
        <Row noGutters className='ml-1'> {/*Method's parameters*/}
          <Col>{/*Thereshold & Min & Max*/}
            <Form.Group as={Row}>
              <Form.Label column sm="9">Do not accout for percentage of minimal values</Form.Label>
              <Col sm="3">
                <Form.Control name="min_percentage" type="number" 
                  min="0" step="1" max="30"
                  onChange={(e) => this.props.form.onChange(e)}
                  value={this.props.form.min_percentage}/>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="9">Plan resolution [mm]</Form.Label>
              <Col sm="3">
                <Form.Control type="number" name="plan_resolution"
                  min="0" max="99.99" step="0.01"
                  onChange={(e) => this.props.form.onChange(e)}
                  value={this.props.form.plan_resolution}/>
              </Col>
            </Form.Group> 
          </Col>
          <Col>
            <Form.Check type="radio" name="analysis" 
              label="Absolute analysis"
              onChange={(e) => this.props.form.onChange(e)}
              value="absolute"
              checked={this.props.form.analysis === "absolute"} />
            <Form.Check type="radio" name="analysis" 
              label="Relative analysis" 
              onChange={(e) => this.props.form.onChange(e)}
              value="relative"
              checked={this.props.form.analysis === "relative"} />
            { this.props.form.analysis === "relative" && 
              <Row noGutters>
                <Form.Check inline label="Adjust maximal doses" 
                  name="adjust_maximal_doses"
                  type='checkbox'
                  onChange={(e) => this.props.form.adjust_minmax_dosesOnChange(e, "adjust_minimal_doses")}
                  checked={this.props.form.adjust_maximal_doses} />
                <Form.Check inline label="Adjust minimal doses" 
                  name="adjust_minimal_doses"
                  type='checkbox'
                  onChange={(e) => this.props.form.adjust_minmax_dosesOnChange(e,"adjust_maximal_doses")}
                  checked={this.props.form.adjust_minimal_doses} />
              </Row>
            }
          </Col>       
        </Row>
        
      </Container>
    )


  }
}

export default CommonOptions;