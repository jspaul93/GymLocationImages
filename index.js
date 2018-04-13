const fs = require('fs'),
	request = require('then-request'),
	gyms = require('PgP-Data/data/gyms'),
	googleSettings = require('./google-settings'),
	settings = require('./settings');

if (!fs.existsSync('./images')) {
	fs.mkdirSync('./images');
}

gyms
	.filter(gym => !fs.existsSync(`./images/${gym.gymId}.png`))
	.forEach(async gym => {
		const id = gym.gymId,
			latitude = gym.gymInfo.latitude,
			longitude = gym.gymInfo.longitude,
			width = settings.width,
			height = settings.height,
			scale = settings.scale,
			zoom = settings.zoom,
			googleKey = googleSettings.google_api_key,
			path = '/maps/api/staticmap?' +
				`size=${width}x${height}&` +
				`scale=${scale}&` +
				`zoom=${zoom}&` +
				`markers=color:red|${latitude},${longitude}&` +
				`key=AIzaSyAZ8PXTu7jvOxo6b_ZkguRfur7n-i-dxg4`;
			
			console.log(path);
			
		await request('GET', `https://maps.googleapis.com${path}`)
			.done(result => fs.writeFileSync(`./images/${id}.png`, result.getBody()), 'binary');
	});
