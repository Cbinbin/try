const router = require('express').Router()
  , request = require('superagent')
  , crypto = require('crypto')
  , wxutil = require('../wxutil')
  , base64 = require('../Base64')
  , token = process.env.TOKEN
  , EncodingAESKey = process.env.ENCODING_AESKEY

router.post('/', (req, res)=> {
  console.log(req.body, req.url)
  var ssss = wxutil(req.query.msg_signature, req.query.timestamp, req.query.nonce, token, req.body.xml.encrypt)
  console.log(ssss)
  request.post('efc8b428.ngrok.ios/wechat/accept')
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
  var ssss = wxutil(req.body.msg_signature, req.body.timestamp, req.body.nonce, token, req.body.xml.encrypt)
  console.log(ssss)
  var encrypt = req.body.xml.encrypt
    , AESKey = base64.decode(EncodingAESKey + '=')
    , encrypt_dec = base64.decode(encrypt)
    , iv = AESKey.substr(0, 16)
  var decipher = crypto.createDecipheriv('aes-128-cbc', AESKey, iv)
  // decipher.setAutoPadding(true)
  var demsg = decipher.update(encrypt_dec, 'binary', 'utf8')

  // demsg = demsg.substring(16)
  // demsg += decipher.final('utf8')
  // var sss = wxutil(req.body.msg_signature, req.body.timestamp, req.body.nonce, token, req.body.xml.encrypt)
  // console.log(sss)
  console.log(demsg)
})

module.exports = router