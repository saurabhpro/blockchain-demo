const express = require('express')
const router = express.Router()
const async = require('async')

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/:page', (req, res, next) => {
  res.render(req.params.page, { page: req.params.page })
})

module.exports = router
