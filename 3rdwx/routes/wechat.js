const router = require('express').Router()
  , request = require('superagent')
  , wxutil = require('../wxutil')

router.post('/', (req, res)=> {
  var ssss = wxutil(req, token, req.body.xml.encrypt)
  console.log(ssss)
  request.post('103933be.ngrok.io/wechat/accept')
  .send({
    xml: req.body.xml, 
    timestamp: req.query.timestamp,
    nonce: req.query.nonce,
    msg_signature: req.query.msg_signature
  })
  .end((err, result)=> {
    if(err) return console.log(err)
    console.log('ok')
  })
  res.send('success')
})

router.post('/accept', (req, res)=> {
  console.log(req.body)
})

module.exports = router