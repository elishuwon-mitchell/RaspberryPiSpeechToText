const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const Storage = require('@google-cloud/storage');


const app = express()
const storage = new Storage();

app.set('port', process.env.PORT || 3000);
app.use('/', express.static(path.join(__dirname, '/public/')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

function runSpeechRecording() {
	//const command = "arecord -D plughw:1,0 -d 4 -r 16000 -t raw -f S16_LE speech.raw";
	const command = "sleep 4"; //test command to ensure blocking before hitting speech API
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

app.get('/run', async (req, res) => {

	let result;
	try {
		result = await runSpeechRecording();
	} catch (err) {
		return res.status(500).send();
	}

	const bucketName = 'eli-mitchell';
	const filename = './speech.raw';
	const options = {
		gzip: true,
		metadata: {
		  cacheControl: 'no-cache',
		},
	}
	storage.bucket(bucketName).upload(filename, options).then(() => {
		console.log(`${filename} uploaded to ${bucketName}.`);
		return res.send(true);
	}).catch(err => {
		console.error('ERROR:', err);
		return res.status(500).send(err);

	});

})

app.listen(app.get('port'), function () {
  console.log('Speech app listening on port', app.get('port'));
});
