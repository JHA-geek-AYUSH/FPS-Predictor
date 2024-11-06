const { users} = require('../../lib/data');

module.exports = {
	name: 'user',
	async get(app, req, res) {
		const { id } = req.body;

		if (users.has(id)) return res.status(200);
		else return res.sendStatus(404);
	},
};
