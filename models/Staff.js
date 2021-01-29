const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const staffSchema = mongoose.Schema({
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

staffSchema.pre('save', function (next) {
	var staff = this; // === staffSchema

	// 비밀번호가 변경될때만 비밀번호 암호화 코드 실행
	if (staff.isModified('password')) {
		// 비밀번호 암호화
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err)
			
			bcrypt.hash(staff.password, salt, function (err, hash) { // hash는 암호화된 비밀번호
				if (err) return next(err)
				
				// staffSchema.password를 hash(암호화된 비밀번호)로 변경
				staff.password = hash
				next() // index.js의 staff.save로 이동
			})
		})
	} else {
		next()
	}
})

// 비밀번호 비교
staffSchema.methods.comparePassword = function (plainPassword, callback) {
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return callback(err)

		callback(null, isMatch)
	})
}

// 토큰 생성
staffSchema.methods.createToken = function (callback) {
	var staff = this;
	// jsonwebtoken을 이용하여 토큰 생성
	var token = jwt.sign(staff._id.toHexString(), 'secretToken')

	staff.token = token
	staff.save(function (err, staff) {
		if (err) return callback(err)
		callback(null, staff)
	})
}

staffSchema.statics.findByToken = function (token, callback) {
	var staff = this;

	// 토큰을 decode
	jwt.verify(token, 'secretToken', function (err, decoded) {
		if (decoded !== undefined) {
			staff.findOne({ '_id': decoded, 'token': token }, function (err, staff) {
				if (err) return callback(err);

				return callback(null, staff);
			})
		} else {
			return callback(null, null)
		}
	})
}

const Staff = mongoose.model('staff', staffSchema)

module.exports = { Staff }