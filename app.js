const express = require('express')
const PROJECT = require('./utils/config.js') 
const Speech = require('@google-cloud/speech');
const fs = require('fs');

const app = express()

const PORT = process.env.PORT || 3000;


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

app.get('/', function (req, res) {
		
	// Detects speech in the audio file
	speechClient.recognize(request)
	  .then((results) => {
		var transcription = results[0].results[0].alternatives[0].transcript;
		res.send(results);		
	  })
	  .catch((err) => {
		console.error('ERROR:', err);
	  });
	
})

app.listen(PORT, function () {
  console.log('Speech app listening on port', PORT)
})
