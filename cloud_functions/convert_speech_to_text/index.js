const speech = require('@google-cloud/speech');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Firestore initialization
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
db.settings({ timestampsInSnapshots: true }); // Firestore date setting

// Speech API Client initialization
const client = new speech.SpeechClient();

exports.convertSpeech = (data, context) => {
	const file = data;

	console.log(`Event ${context.eventId}: Starting to process speech file ${file.name} created on ${file.timeCreated}`);

	const bucketName = 'eli-mitchell';

	const audio = {
		uri: `gs://${bucketName}/${file.name}`
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

	client.recognize(request).then(async (results) => {
		console.log(results);
		const transcription = results[0].results[0] ? results[0].results[0].alternatives[0].transcript: "Error: Could not convert speech to text";
		console.log("Translated text:", transcription);
		try {
			await db.collection('speech').add({
				text: transcription,
				date: new Date()
			});	
			console.log("Firestore save success.");
		} catch (error) {
			console.error("Firestore save failed: ", error);
		}
	}).catch((err) => {
		console.error('ERROR:', err);
	});
};
