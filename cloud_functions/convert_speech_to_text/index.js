const speech = require('@google-cloud/speech');

exports.convertSpeech = async (data, context) => {

	const file = data;
	console.log(`Event ${context.eventId}: Starting to process speech file ${file.name} created on ${file.timeCreated}`);

	const client = new speech.v1.SpeechClient();

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

	client.recognize(request).then((results) => {
      	console.log(results);
		const transcription = results[0].results[0].alternatives[0].transcript;
		console.log("Translated text:", transcription);
	}).catch((err) => {
		console.error('ERROR:', err);
	});
};
