const express = require('express');
const path = require('path');
const PROJECT = require('./utils/config.js');
const Speech = require('@google-cloud/speech');
const fs = require('fs');
const { exec } = require('child_process');

const app = express()

app.set('port', process.env.PORT || 3000);
app.use('/', express.static(path.join(__dirname, '/public/')));


app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});


app.get('/speech', function(req, res){
	
	var command = "arecord -D plughw:1,0 -d 4 -r 16000 -t raw -f S16_LE speech.raw;aplay -r 16000 -t raw -f S16_LE speech.raw";
	exec(command, (err, stdout, stderr) => {
		if(err){
			res.send("There was an error executing the command");
			return;
		}
		
		// Instantiates a client
		const speechClient = Speech({
		  projectId: PROJECT.id
		});

		// The name of the audio file to transcribe
		const fileName = './speech.raw';

		// Reads a local audio file and converts it to base64
		const file = fs.readFileSync(fileName);
		const audioBytes = file.toString('base64');

		// The audio file's encoding, sample rate in hertz, and BCP-47 language code
		const audio = {
		  content: audioBytes
		};
		const config = {
		  encoding: 'LINEAR16',
		  sampleRateHertz: 16000,
		  languageCode: 'en-US'
		};

		const request = {
		  audio: audio,
		  config: config
		};
		
		// Detects speech in the audio file
		speechClient.recognize(request)
		  .then((results) => {
			var transcription = results[0].results[0].alternatives[0].transcript;
			res.send("You said: " + transcription);		
		  })
		  .catch((err) => {
			console.error('ERROR:', err);
		});
		
		console.log(stdout);
		console.log(stderr);		
	});
		
});

app.listen(app.get('port'), function () {
  console.log('Speech app listening on port', app.get('port'));
});
