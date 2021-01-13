// 인증 처리
const { User } = require('../models/User');

let auth = (req, res, next) => {
	// 클라이언트 쿠키에서 토큰을 가져옴
	let token = req.cookies.authToken;

	// 토큰 복호화하여 유저 찾기
	User.findByToken(token, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({ ifAuth: false, error: true });

		req.token = token;
		req.user = user;
		next();
	})
}

module.exports = { auth };