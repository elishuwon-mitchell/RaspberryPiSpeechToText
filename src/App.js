import React, { Component } from 'react';
import { Button } from 'material-ui';
import PropTypes from 'prop-types';

import axios from 'axios';
import Countdown from 'react-countdown-now';

import Response from "./Response.js";

class App extends Component {
	constructor() {
		super();

		this.state = {
			response: undefined
		};

		this.handleRecordInput = this.handleRecordInput.bind(this);
		this.handleClear = this.handleClear.bind(this);
	};

	handleRecordInput() {
		axios.get("/speech").then((res) => {
			console.log(res);
			this.setState({
				response: res
			})
		});
	}

	handleClear() {
		this.setState({
			response: undefined
		})
	}

	render() {
		return (
			<div className="appContainer">
				<h1> Speech to Text using Google Speech Api</h1>
				<div className="buttonContainer">
				<Button raised onClick={this.handleRecordInput} color="primary">
					Record Input
				</Button>
				<Button raised onClick={this.handleClear} color="secondary">
					Clear
				</Button>
				</div>
				<div id="responseContainer">
					{this.state.response ? <Response translatedText={this.state.response.data} /> : ""}
				</div>
			</div>
		)
	};
}

export default App;
