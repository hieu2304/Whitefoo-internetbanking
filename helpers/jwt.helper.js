const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

module.exports.jwtEx = function(req, res, next) {
	const { secret } = config;
	// 1 só path dưới đây sẽ được miễn yêu cầu token, còn lại nếu ko có token sẽ có thông báo "invalid token
	return expressJwt({ secret }).unless({
		path: [ '/api/auth/login', '/api/register', '/api/auth/logout' ]
	});
};

module.exports.reGenerateToken = function(req, res, next) {
	const previousToken = req.headers['token'];
	if (previousToken == null) return res.status(401).send({ message: 'Invalid token' });

	jwt.verify(previousToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.status(401).send({ message: 'Invalid token' });
		const token = this.generateToken({
			id: user.id,
			citizenIdentificationId: user.citizenIdentificationId,
			email: user.email,
			phoneNumber: user.phoneNumber,
			username: user.username,
			lastName: user.lastName,
			firstName: user.firstName,
			dateOfBirth: user.dateOfBirth,
			address: user.address,
			userType: user.userType,
			status: user.status,
			approveStatus: user.approveStatus,
			enable2fa: user.enable2fa,
			createdAt: user.createdAt,
			emailVerified: user.emailVerified
		});

		return res.json({ token: token });
	});
};

module.exports.generateToken = function(user) {
	return (accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }));
};

module.exports.decodeToken = function decodeToken(token) {
	//Use promise, to use return result, have to use json decode
	// return new Promise((resolve, reject) => {
	// 	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
	// 		if (err) {
	// 			return reject(err);
	// 		}
	// 		resolve({ user: decoded });
	// 	});
	// });

	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
		if (err) {
			return null;
		} else {
			return user;
		}
	});
};
