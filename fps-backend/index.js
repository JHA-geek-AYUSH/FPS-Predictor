const express = require('express');
const path = require('path');
const fs = require('fs');
const fsProm = fs.promises;
const compression = require('compression');
require('dotenv').config();
const cors = require('cors');
const si = require('systeminformation');
const { network, cpu, gpu, memory, wifi } = require('./lib/data');

si.cpu()
	.then(data => console.log(data))
	.catch(error => console.error(error));


const app = express();

const adminRoutes = fs
	.readdirSync('./routes/admin')
	.filter((file) => file.endsWith('.js'));

const clientRoutes = fs
	.readdirSync('./routes/client')
	.filter((file) => file.endsWith('.js'));

app.use(express.json());
app.use(compression());
app.use(cors());

async function connect() {
	console.log(
		'------------------ HACKATHON - SERVER ------------------------------------------------',
	);

	await handleRoutes();

	await fetchData();

	app.listen(process.env.PORT, () => {
		console.log(
			`API running on: http://localhost:${process.env.PORT}/`,
		);
	});
}

async function fetchData() {
	app.cpu = await si.cpu();
	app.gpu = (await si.graphics())['controllers'][0];
	app.mem = await si.mem();
	app.network = (await si.networkInterfaces())[0];
	app.wifi = (await si.wifiNetworks())[0];

	console.log(app.network, app.wifi, app.gpu)
}

const routePaths = {
	adminRoutes: 'admin',
	clientRoutes: 'client',
};

const routeRegistry = new Map();

async function loadEndpoint(routePath, fileName) {
	const endpointPath = path.join(__dirname, 'routes', routePath, fileName);
	return require(endpointPath);
}

async function registerRoute(App, basePath, methods) {
	const [fileName] = basePath.split('/').slice(-1);
	const endpoint = await loadEndpoint(
		basePath.split('/').slice(1, -1).join('/'),
		`${fileName}.js`,
	);

	methods.forEach((method) => {
		if (endpoint[method]) {
			App[method](basePath, async (req, res) => {
				try {
					await endpoint[method](app, req, res);
				} catch (error) {
					console.error(`Error handling route: ${error}`);
					res.sendStatus(500);
				}
			});
			routeRegistry.set(
				`${basePath}_${method.toLowerCase()}`,
				endpoint[method],
			);
		}
	});
}

async function handleRequest(req, res) {
	const { method, originalUrl } = req;
	const handler = routeRegistry.get(`${originalUrl}_${method.toLowerCase()}`);

	if (handler) {
		try {
			await handler(req, res);
		} catch (error) {
			console.error(`Error handling route: ${error}`);
			res.sendStatus(500);
		}
	} else {
		console.log(
			`Request sent from IP: ${req.ip} for invalid method  ${method}: ${originalUrl}`,
		);
		res.sendStatus(404);
	}
}

async function handleRoutes() {
	const methods = ['get', 'post', 'put', 'delete'];
	const routeDirs = [adminRoutes, clientRoutes];

	for (const dir of routeDirs) {
		const routePath =
			routePaths[dir === adminRoutes ? 'adminRoutes' : 'clientRoutes'];
		const fileNames = await fsProm.readdir(
			path.join(__dirname, 'routes', routePath),
		);

		for (const fileName of fileNames) {
			if (fileName.endsWith('.js')) {
				const basePath = `/${routePath}/${path.basename(fileName, '.js')}`;
				await registerRoute(app, basePath, methods);
			}
		}
	}
	app.use(handleRequest);
	console.log('Registered all Routes');
}

// ---------------------------------------------------------------------------------------------

connect().catch((e) => console.error(e));

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection: ', error);
});
