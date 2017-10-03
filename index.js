const https = require('https'),
	fs = require('fs'),
	gyms = require('./gyms'),
	googleSettings = require('./google-settings'),
	settings = require('./settings');

if (!fs.existsSync('./images')) {
	fs.mkdirSync('./images');
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

gyms.forEach(async gym => {
	const id = gym.gymId,
		latitude = gym.gymInfo.latitude,
		longitude = gym.gymInfo.longitude,
		width = settings.width,
		height = settings.height,
		scale = settings.scale,
		zoom = settings.zoom,
		googleKey = googleSettings.google_api_key,
		url = 'https://maps.googleapis.com/maps/api/staticmap?' +
			`size=${width}x${height}&` +
			`scale=${scale}&` +
			`zoom=${zoom}&` +
			`markers=color:red|${latitude},${longitude}&` +
			`key=${googleKey}&`;

	https.get(url, result => {
		const data = [];

		result
			.on('data', chunk => data.push(chunk))
			.on('end', () => {
				const buffer = Buffer.concat(data);
				fs.writeFileSync(`./images/${id}.png`, buffer, 'binary');
			})
			.on('error', err => {
				console.log("Error during HTTP request");
				console.log(err.message);
			});
	});

	await sleep(100);
});
