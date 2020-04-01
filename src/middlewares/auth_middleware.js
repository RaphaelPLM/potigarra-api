const jwt = require('jsonwebtoken');

module.exports = {
	verifyToken(request, response, next) {
		const bearerHeader = request.headers['x-access-token'] || request.headers['authorization'];;

		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

			jwt.verify(bearerToken, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
				if (err) {
                    console.log('\n [ERROR] err.name')
                    
                    return response.status(401).json({ error: 'Unauthorized access.' });
				}

				request.decoded = decoded;
				next();
			});
		} else {
			return response.status(403).json({ error: 'Forbidden access.' });
		}
	}
};
