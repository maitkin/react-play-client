import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import { wssend, mylog } from '../main'
import {FormControl, FormGroup, ControlLabel,
				HelpBlock, Grid, Col, Row, Button,
				ButtonToolbar, Image} from  'react-bootstrap'


export class Timers extends Component {

	constructor(props) {
		super(props)
		this.state = { value: "" }
	}

	handleChange(e) {
		console.log("handleChange",e)
		this.setState({ value: e.target.value });
	}
	
	handleSubmit(e) {
		e.preventDefault()
		if (this.getValidationState() != "success") return
		var val = parseInt(this.state.value) * 1000
		wssend({ action: "set-timer", value: val.toString() })
		this.setState({ value: ""  })
		console.log("handle submit")
	}

	handlePause(e,id) {
		e.preventDefault()
		wssend({ action: "pause-timer", value: id })
		console.log("handle pause "+id)
	}

	handleResume(e,id) {
		e.preventDefault()
		wssend({ action: "resume-timer", value: id })
		console.log("handle resume "+id)
	}

	getValidationState() {
    const length = this.state.value.length;
		if (length == 0) return null;
    if (length <= 4 && (!isNaN(parseInt(this.state.value)))) return 'success';
    return 'error';
  }
	
	render() {

    return (
			<div className="home">				
				<div className="form1">
					<form onSubmit={this.handleSubmit.bind(this)}>
						<FormGroup controlId="TimerForm"
											 validationState={this.getValidationState()}>
							<Row>
								<Col xs={12}>
									<ControlLabel>Create a timer</ControlLabel>
								</Col>
							</Row>
							<Row>
								<Col xs={12} sm={4}>
									<FormControl type="text"
															 value={this.state.value}
															 placeholder="Enter a duration in seconds"
															 onChange={this.handleChange.bind(this)}/>
								</Col>
							</Row>
							<Row>
								<Col xs={12} sm={4}>
									<FormControl.Feedback />
									<HelpBlock>Integers less-than-or-equal to 1000</HelpBlock>
								</Col>
							</Row>
						</FormGroup>
						<Row>
							<Col xs={4}>
								<Button bsStyle="primary" type="submit">
									Submit
								</Button>
							</Col>
						</Row>
						</form>
				</div>
				<div className="timers">
					{
						this.props.timers.map(function (timer) {						
							var pause_disabled = timer.get('isPaused') === "true" || timer.get('isRunning') === "false"
							return <Row>
					<Col xs={12} sm={4}>
						<ButtonToolbar>
							<Button bsStyle="warning" disabled={pause_disabled} onClick={(evt) => this.handlePause(evt, timer.get('id'))}>Pause</Button>
							<Button bsStyle="success" disabled={timer.get('isPaused') === "false"}  onClick={(evt) => this.handleResume(evt, timer.get('id'))}>Resume</Button>
							<Button disabled>{Math.round(timer.get('remaining')/1000)}</Button>
						</ButtonToolbar>
					</Col>

							</Row>
						}, this)
					}
				</div>
			</div>
    );
  }
}

function mapStateToProps(state) {
	return ({
		timers: state.myReducer.get('timers')
  })
}


export const TimersView = connect(mapStateToProps)(Timers);
