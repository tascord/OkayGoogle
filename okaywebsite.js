const config = require('./config.json')
const http = require('http');
const fs = require('fs');
const url = require('url');
const fetch = require('node-fetch');
const FormData = require('form-data');
const port = 8000;

http.createServer((req, res) => {

	let responseCode = 404;
	let content = '404 Error';

	const urlObj = url.parse(req.url, true);

	if (urlObj.query.code) {
		const accessCode = urlObj.query.code;
		const data = new FormData();

		data.append('client_id', config.clientid);
		data.append('client_secret', config.secret);
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', config.redirecturi);
		data.append('scope', 'identify');
		data.append('code', accessCode);

		fetch('https://discordapp.com/api/oauth2/token', {
			method: 'POST',
			body: data,
		})
			.then(discordRes => discordRes.json());
	}

	if (urlObj.pathname === '/') {
		responseCode = 200;
		content = fs.readFileSync('./Pages/index.html');
	}

	res.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
	});

	res.write(content);
	res.end();
})
	.listen(port);
