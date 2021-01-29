const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');
const { auth } = require('../middleware/auth');

const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const AWS = require('aws-sdk');
const moment = require('moment');

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

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY
});

const uploadImageS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'my-cafe/products',
    region: 'ap-northeast-2',
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    }
  })
})

router.post('/image', uploadImageS3.single('file'), async (req, res) => {
  try {
    res.status(200).json({ success: true, url: req.file.location})
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, url: '' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const product = new Product(req.body)

    const result = await product.save()
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ err })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.status(200).json({ success: true, item: product })
  } catch (err) {
    res.status(400).json({ success: false, err })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const modifiedPost = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        update_date: moment().format("YYYY-MM-DD HH:mm:ss")
      }
    )
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ err })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id })
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ err })
  }
})

module.exports = router;