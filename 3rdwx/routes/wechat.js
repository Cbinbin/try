const router = require('express').Router()
  , request = require('superagent')
  , crypto = require('crypto')
  , url = require('url')
  , verifySignature = require('../utils/verifySignature')
  , wxBizMsgCrypto = require('../utils/wxBizMsgCrypto')
  , xml2jsonString = require('xml2js').parseString
  , token = process.env.TOKEN
  , encodingAesKey = process.env.ENCODING_AESKEY
  , appId = process.env.APPID
  , ComponentVerifyTicket = null

router.post('/', (req, res)=> {
  console.log(ComponentVerifyTicket) //原
  var URL = url.parse(req.url, true)
  if(URL.query.encrypt_type != 'aes') return console.log({code: 504, errMsg: 'It is not AES', data: {} })
  var msg_sign = req.query.msg_signature
    , timestamp = req.query.timestamp
    , nonce = req.query.nonce
    , xml = req.body.xml
    , verifySignT = verifySignature(msg_sign, timestamp, nonce, token, xml.encrypt)
  if(!verifySignT) return console.log({code: 505, errMsg: 'Illegal verification', data: {} })
  var pc = new wxBizMsgCrypto(encodingAesKey, appId)
    , resultObj = pc.decryptMsg(xml)
  if(resultObj.appid === appId) {
    xml2jsonString(resultObj.msgXml, {async:true}, (err, resObj)=> {
      ComponentVerifyTicket = resObj.xml.ComponentVerifyTicket
      console.log(resObj.xml)
      console.log(ComponentVerifyTicket)
    })
  } else {
    console.log({code: 506, errMsg: 'Different appIds', data: {} })
  }
  res.send('success')
})

router.post('/accept', (req, res)=> {
  var msg_sign = 'xxx'
    , timestamp = 000
    , nonce = 000
  var xml = {
    encrypt: 'xxx'
  }
    , verifySignT = verifySignature(msg_sign, timestamp, nonce, token, xml.encrypt)
  if(!verifySignT) return res.send({code: 505, errMsg: 'Illegal verification', data: {} })
  var pc = new wxBizMsgCrypto(encodingAesKey, appId)
    , resultObj = pc.decryptMsg(xml)
  if(resultObj.appid === appId) {
    xml2jsonString(resultObj.msgXml, {async:true}, (err, resObj)=> {
      var ComponentVerifyTicket = resObj.xml.ComponentVerifyTicket
      res.send(resObj.xml)
    })
  } else {
    res.send({code: 506, errMsg: 'Different appIds', data: {} })
  }
})

router.post('/encrypt', (req, res)=> {
  const text = req.body.text
  var pc = new wxBizMsgCrypto(encodingAesKey, appId)
    , msg_encrypt = pc.encryptMsg(text)
  res.send(msg_encrypt)
})

module.exports = router