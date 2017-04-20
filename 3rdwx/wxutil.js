const crypto = require('crypto')
  , url = require('url')
  , sha1 = crypto.createHash('sha1')

function wxutil(req, token, msg_encrypt) {
  var msg_signature = req.query.msg_signature
    , timestamp = req.query.timestamp
    , nonce = req.query.nonce
    , dev_msg_signature = sha1(sort(token, timestamp, nonce, msg_encrypt))
    , pass = false
  console.log(timestamp, nonce, dev_msg_signature, msg_signature)
  if(dev_msg_signature === msg_signature) pass = true
  return pass
}

module.exports = wxutil