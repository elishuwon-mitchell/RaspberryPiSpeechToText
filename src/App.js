import React, {Component} from 'react';
import {Button} from 'material-ui';
import PropTypes from 'prop-types';

import axios from 'axios';



class App extends Component{
	constructor(){
		super();
		
		this.handleRecordInput = this.handleRecordInput.bind(this);
		
	};
	
	handleRecordInput(){
		console.log("Beginning record input");
		axios.get("/speech").then((res) =>{
			console.log(res);
			document.getElementById("responseContainer").innerHTML = res;
		});
	};
	
	render(){
		return(
			<div id="appContainer">
				<h1> Speech to Text using Google Speech Api</h1>	
				<Button raised onClick={this.handleRecordInput} color="primary">
					Record Input
				</Button>
				<div id="responseContainer">
				</div>
			</div>
		)
	};
}

export default App;
