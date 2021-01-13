const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.post('/register', (req, res) => {
	// 회원가입에 필요한 정보들을 client에서 가져오면 db에 저장
	const user = new User(req.body)
	user.save((err) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).json({ success: true })
	})
})

router.post('/login', (req, res) => {
	// 요청된 이메일을 db에서 찾기
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) return res.json({ success: false, err })

		if (!user) {
			return res.json({
				success: false,
				message: '가입되지 않은 이메일입니다.'
			})
		}

		// 이메일이 있는 경우 비밀번호가 맞는지 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch) return res.json({ success: false, message: '비밀번호가 틀렸습니다.'})
		
			// 비밀번호가 맞다면 token 생성
			user.createToken((err, user) => {
        if (err) return res.status(400).send(err);

				// 토큰을 쿠키에 저장
				res.cookie('authToken', user.token).status(200).json({success: true, userId: user._id})
			})
		})
	})
})

router.get('/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image
	})
})

router.get('/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).send({success: true})
	})
})

module.exports = router;
