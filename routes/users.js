const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

//=================================
//             User
//=================================

router.get('/', async (req, res) => {
  let { page, perPage, name, email } = req.query
  let limit = perPage ? parseInt(perPage) : 20; // 가져올 데이터 수
  let skip = page === 1 ? 0 : ((parseInt(page) - 1) * limit); // 스킵할 데이터 수
  let totalLength = 0; // 총 데이터 수

  let findArgs = []; // 검색 조건

  if (name) {
    findArgs.push({
      name: { $regex: name, $options: "i" }
    });
  }
  if (email) {
    findArgs.push({
      email: { $regex: email, $options: 'i' }
    })
  }

  // 검색조건이 유무
  if (findArgs.length) {
    totalLength = await User.countDocuments({ $and: [...findArgs] })

    try {
      const lists = await User.find({ $and: [...findArgs] }).skip(skip).limit(limit)
      res.status(200).json({ success: true, lists, total: totalLength })
    } catch (err) {
      res.status(400).json({ success: false, err })
    }
  } else {
    totalLength = await User.countDocuments()

    try {
      const lists = await User.find().skip(skip).limit(limit)
      res.status(200).json({ success: true, lists, total: totalLength })
    } catch (err) {
      res.status(400).json({ success: false, err })
    }
  } 
});

module.exports = router;