const { password } = require('../../lib/data');


module.exports = {
	name: 'login',
	async get(app, req, res) {
		process.env.PASSWORD === req.get('Authorization') ?
			res.json({ token: password })
			:	res.sendStatus(401);
	},
};
