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

function runSpeechRecording() {
	// const command = "arecord -D plughw:1,0 -d 4 -r 16000 -t raw -f S16_LE speech.raw;aplay -r 16000 -t raw -f S16_LE speech.raw";
	const command = "sleep 2";
	return new Promise((resolve, reject) => {
		exec(command, (err, stdout, stderr) => {
			if(err) {
				console.log(`Error executing speech command: ${err}`);
				reject(err);
			}
			console.log(`Stdout: ${stdout}`);
			resolve(true);
		});
	});
}

app.get('/speech', async function(req, res) {

	let result;
	try {
		result = await runSpeechRecording();
	} catch (error) {
		return res.status(500).send();
	}
	
	return res.send("This is a test");
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
	speechClient.recognize(request).then((results) => {
		const transcription = results[0].results[0].alternatives[0].transcript;
		res.send(transcription);		
	}).catch((err) => {
		console.error('ERROR:', err);
	});

});

app.listen(app.get('port'), function () {
  console.log('Speech app listening on port', app.get('port'));
});
