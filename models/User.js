const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	email: {
		type: String,
		trim: true,
		unique: 1
	},
	password: {
		type: String,
		minlength: 5
	},
	lastname: {
		type: String,
		maxlength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: {
		type: String
	},
	tokenExp: {  // 토큰 유효기간
		type: Number
	}	
})

userSchema.pre('save', function (next) {
	var user = this; // === userSchema

	// 비밀번호가 변경될때만 비밀번호 암호화 코드 실행
	if (user.isModified('password')) {
		// 비밀번호 암호화
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err)
			
			bcrypt.hash(user.password, salt, function (err, hash) { // hash는 암호화된 비밀번호
				if (err) return next(err)
				
				// userSchema.password를 hash(암호화된 비밀번호)로 변경
				user.password = hash
				next() // index.js의 user.save로 이동
			})
		})
	} else {
		next()
	}
})

// 비밀번호 비교
userSchema.methods.comparePassword = function (plainPassword, callback) {
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return callback(err)

		callback(null, isMatch)
	})
}

// 토큰 생성
userSchema.methods.createToken = function (callback) {
	var user = this;
	// jsonwebtoken을 이용하여 토큰 생성
	var token = jwt.sign(user._id.toHexString(), 'secretToken')

	user.token = token
	user.save(function (err, user) {
		if (err) return callback(err)
		callback(null, user)
	})
}

userSchema.statics.findByToken = function (token, callback) {
	var user = this;

	// 토큰을 decode
	jwt.verify(token, 'secretToken', function (err, decoded) {
		// 유저 아이디를 이용해서 유저를 찾고
		// 클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인
		user.findOne({ '_id': decoded, 'token': token }, function (err, user) {
			if (err) return callback(err);
			callback(null, user);
		})
	})
}

const User = mongoose.model('staff', userSchema)

module.exports = { User }