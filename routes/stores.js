const express = require('express');
const router = express.Router();
const { Store } = require('../models/Store');
const { auth } = require('../middleware/auth');
const moment = require('moment');

//=================================
//             Store
//=================================

router.get('/', async (req, res) => {
  let { page, perPage, store, sido, gugun } = req.query;
  let limit = perPage ? parseInt(perPage) : 20;
  let skip = page === 1 ? 0 : ((parseInt(page) - 1) * limit);
  let totalLength = 0;

  let findArgs = []; // 검색 조건

  if(store) {
    findArgs.push({
      category: { $regex: store }
    });
  }
  if(sido) {
    findArgs.push({
      product_name: { $regex: sido }
    })
  }
  if(gugun) {
    findArgs.push({
      product_name: { $regex: gugun }
    })
  }

  // 검색조건이 유무
  if (findArgs.length) {
    totalLength = await Store.countDocuments({ $and: [...findArgs] })

    try {
      const lists = await Store.find({ $and: [...findArgs] }).skip(skip).limit(limit)
      res.status(200).json({ success: true, lists, total: totalLength })
    } catch (err) {
      res.status(400).json({ success: false, err })
    }
  } else {
    totalLength = await Store.countDocuments()

    try {
      const lists = await Store.find().skip(skip).limit(limit)
      res.status(200).json({ success: true, lists, total: totalLength })
    } catch (err) {
      res.status(400).json({ success: false, err })
    }
  } 
})

router.post('/', auth, async (req, res) => {
  try {
    const store = new Store(req.body)

    await store.save()
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ err })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
    res.status(200).json({ success: true, item: store })
  } catch (err) {
    res.status(400).json({ success: false, err })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    await Store.findByIdAndUpdate(
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
    await Store.deleteOne({ _id: req.params.id })
    res.status(200).json({ success: true })
  } catch (err) {
    res.status(400).json({ err })
  }
})

module.exports = router;
