import React, { Component } from 'react';
import { 
	Button, 
	AppBar, 
	Toolbar, 
	Typography, 
	CircularProgress, 
	Card, 
	CardActions, 
	CardContent, 
	Divider,
	MuiThemeProvider,
	createMuiTheme
} from '@material-ui/core';

import axios from 'axios';
import Countdown from 'react-countdown-now';
import socketIOClient from "socket.io-client";

const theme = createMuiTheme({
	palette: {
	  type: 'dark',
	  primary: {
		main: '#66bb6a',
	  },
	  secondary: {
		main: '#b71c1c',
	  },
	},
});

class App extends Component {
	constructor() {
		super();

		this.state = {
			response: undefined,
			inProgress: false,
			endpoint: "http://localhost:3000"
		};

		this.handleRecordInput = this.handleRecordInput.bind(this);
		this.handleClear = this.handleClear.bind(this);
	};

	componentDidMount() {
		const { endpoint } = this.state;
		const socket = socketIOClient(endpoint);
		socket.on("messageRecieved", data => {
			console.log("data: ", data);
			this.setState({ 
				response: data,
				inProgress: false
			});
		});
	  }

	handleRecordInput() {
		this.setState({
			inProgress: true
		}, () => {
			axios.get("/run").then((res) => {
				console.log("uploading to pubsub success?:", res);
			});
		});
	}

	handleClear() {
		this.setState({
			response: undefined,
			inProgress: false
		});
	}

	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<div className="appContainer">
					<AppBar position="static">
						<Toolbar>
							<Typography variant="headline" component="h1">
								Speech to Text using Google Speech Api
							</Typography>
						</Toolbar>
					</AppBar>
					<Card className="cardContainer">
						<CardContent>
						{
							this.state.inProgress ? 
								<CircularProgress className="progress" thickness={7} /> 
							:
								<Typography component="p">
									{this.state.response ? `You said: ${this.state.response}` : ''}
								</Typography>
						}
						</CardContent>
						<Divider />
						<CardActions className="cardActions">
							<Button onClick={this.handleRecordInput} color="primary">
								Record Input
							</Button>
							<Button onClick={this.handleClear} color="secondary">
								Clear
							</Button>
						</CardActions>
					</Card>
				</div>
			</MuiThemeProvider>
		)
	};
}

export default App;
