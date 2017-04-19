const router = require('express').Router()
  // , host = require('../utils/hosturl')

router.get('/', (req, res)=> {
  res.json({
    api: 'https://localhost:?/'
  })
})

module.exports = router