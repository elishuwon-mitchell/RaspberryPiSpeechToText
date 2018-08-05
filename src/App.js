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
			inProgress: false
		};

		this.handleRecordInput = this.handleRecordInput.bind(this);
		this.handleClear = this.handleClear.bind(this);
	};

	handleRecordInput() {
		this.setState({
			inProgress: true
		}, () => {
		axios.get("/speech").then((res) => {
			console.log(res);
			this.setState({
				response: res,
				inProgress: false
			})
		});
		});
	}

	handleClear() {
		this.setState({
			response: undefined
		})
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
									{this.state.response ? `You said: ${this.state.response.data}` : ''}
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
