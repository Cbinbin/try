const router = require('express').Router()
  , request = require('superagent')
  , wxutil = require('../wxutil')
  , token = process.env.TOKEN

router.post('/', (req, res)=> {
  var ssss = wxutil(req.query.msg_signature, req.query.timestamp, req.query.nonce, token, req.body.xml.encrypt)
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
  var sss = wxutil(req.body.msg_signature, req.body.timestamp, req.body.nonce, token, req.body.xml.encrypt)
})

module.exports = router