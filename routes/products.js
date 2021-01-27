const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

router.get('/', async (req, res) => {
  let { page, perPage, category, product_name } = req.query;
  let limit = perPage ? parseInt(perPage) : 20;
  let skip = page === 1 ? 0 : ((parseInt(page) - 1) * limit);
  let totalLength = 0;

  let findArgs = []; // 검색 조건

  if(category) {
    findArgs.push({
      category: { $regex: category }
    });
  }
  if(product_name) {
    findArgs.push({
      product_name: { $regex: product_name, $options: 'i' }
    })
  }

  // 검색조건이 유무
  if (findArgs.length) {
    totalLength = await Product.countDocuments({ $and: [...findArgs] })

    try {
      const lists = await Product.find({ $and: [...findArgs] }).skip(skip).limit(limit)
      res.status(200).json({ success: true, lists, total: totalLength })
    } catch (err) {
      res.status(400).json({ success: false, err })
    }
  } else {
    totalLength = await Product.countDocuments()

    try {
      const lists = await Product.find().skip(skip).limit(limit)
      res.status(200).json({ success: true, lists, total: totalLength })
    } catch (err) {
      res.status(400).json({ success: false, err })
    }
  } 
})

module.exports = router;