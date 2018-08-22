const speech = require('@google-cloud/speech');
const PubSub = require(`@google-cloud/pubsub`);

// Speech API Client initialization
const client = new speech.SpeechClient();

// PubSub client initialization
const pubsub = new PubSub();
const topicName = 'rpi_speech_text';

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

	return client.recognize(request).then(async (results) => {
		console.log(results[0].results[0]);
		const transcription = results[0].results[0] ? results[0].results[0].alternatives[0].transcript: "Error: Could not convert speech to text";
		console.log("Translated text:", transcription);
		const pubSubData = JSON.stringify({ text: transcription});
		const dataBuffer = Buffer.from(pubSubData);

		return pubsub.topic(topicName).publisher().publish(dataBuffer).then(messageId => {
			console.log(`Successfully publisehd to pubsub: ${messageId}.`);
		})
		.catch(err => {
			console.error('Failed posting to pubsub:', err);
		});
	}).catch((err) => {
		console.error('ERROR:', err);
	});
};
