const express = require('express');
const router = express.Router();
const { Staff } = require("../models/Staff");

const { auth } = require("../middleware/auth");

//=================================
//             Staff
//=================================

router.post('/register', (req, res) => {
	// 회원가입에 필요한 정보들을 client에서 가져오면 db에 저장
	const staff = new Staff(req.body)
	staff.save((err) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).json({ success: true })
	})
})

router.post('/login', (req, res) => {
	// 요청된 이메일을 db에서 찾기
	Staff.findOne({ email: req.body.email }, (err, staff) => {
		if (err) return res.json({ success: false, err })

		if (!staff) {
			return res.json({
				success: false,
				message: '가입되지 않은 이메일입니다.'
			})
		}

		// 이메일이 있는 경우 비밀번호가 맞는지 확인
		staff.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch) return res.json({ success: false, message: '비밀번호가 틀렸습니다.'})
		
			// 비밀번호가 맞다면 token 생성
			staff.createToken((err, staff) => {
        if (err) return res.status(400).send(err);

				// 토큰을 쿠키에 저장
				res.cookie('authToken', staff.token).status(200).json({success: true, staffId: staff._id})
			})
		})
	})
})

router.get('/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req.staff._id,
		isAdmin: req.staff.role === 0 ? false : true,
		isAuth: true,
		email: req.staff.email,
		name: req.staff.name,
		lastname: req.staff.lastname,
		role: req.staff.role,
		image: req.staff.image
	})
})

router.get('/logout', auth, (req, res) => {
	Staff.findOneAndUpdate({ _id: req.staff._id }, { token: '' }, (err, staff) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).send({success: true})
	})
})

module.exports = router;
