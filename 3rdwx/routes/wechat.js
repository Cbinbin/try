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
  request.post('efc8b428.ngrok.io/wechat/accept')
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
  var encrypt = req.body.xml.encrypt//'+KcSzmXyUTFAOqdtbgoUgCNXEu66Aevk3Q40mHTvjgtfErtVoBtiBUaNTBaTVRpmvB0eSn4RfT+XTGcD1h35mRS9hFl3dOE6+RbEN5S6dNd//VTP5gDkSMoScfh1HAocYriHu5HoXO9dXArAdfaM75xVO9fKZ5eS+g5RYSyCalcXy8HNmq0kPB/mcs4Y3AEf0lIfeSZloFFRb9sD9Z87duFR3mK3+H9PMZM5+w4uIV6r21x8Zex8EEvu2Jo+WwS8HVd4IBHCXWvfgNgXX4SX2tgI4f/A53UOsJYSv45JRGTnq0BBpV3JavI1eWgmt4cXUWac4pD5cyda/1LBuzUUG0PECJzMx8jySHqq4gi3WF9flMOS8HEOyRRcikXfdnlh7yScFsGD7jt7z2zcFIo46ThIbv7VylawxeouVr+1EiBFLDlz/3FpYDHAzdDHCKoIQrwOv6zniP2LcQvdwW45Rg=='
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