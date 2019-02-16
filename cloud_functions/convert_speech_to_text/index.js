const speech = require('@google-cloud/speech');
const PubSub = require(`@google-cloud/pubsub`);

const appConfig = {
	pubsub: {
		topicName: ''
	},
	cloudStorage: {
		bucketName: ''
	}
};

// Speech API Client initialization
const client = new speech.SpeechClient();

// PubSub client initialization
const pubsub = new PubSub();
const topicName = appConfig.pubsub.topicName;

exports.convertSpeech = async (data, context) => {
	const file = data;

	console.log(`Event ${context.eventId}: Starting to process speech file ${file.name} created on ${file.timeCreated}`);

	const bucketName = appConfig.cloudStorage.bucketName;

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

	try {
		// Make call to speech api
		const results = await client.recognize(request);
		console.log(results[0].results[0]);
		// Parse results from speech api
		const transcription = results[0].results[0] 
			? results[0].results[0].alternatives[0].transcript
			: "Error: Could not convert speech to text";
		console.log("Translated text:", transcription);
		// Transform translated text to type that can be sent via pubsub
		const pubSubData = JSON.stringify({ text: transcription});
		const dataBuffer = Buffer.from(pubSubData);
		try {
			// Make call to pubsub to publish translated text
			await pubsub.topic(topicName).publisher().publish(dataBuffer);
			console.log(`Successfully publisehd to pubsub: ${messageId}.`);
			return;
		} catch (error) {
			console.error(`Failed posting to pubsub: ${err}`);
		}
		
	} catch (error) {
		console.error(`Failed to convert speect: ${err}`);
	}
};
