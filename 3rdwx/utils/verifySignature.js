const crypto = require('crypto')

function verifySignature(msg_signature, timestamp, nonce, token, msg_encrypt) {
  var sha1 = crypto.createHash('sha1')
    , dev_msg_signature = sha1.update([token, timestamp, nonce, msg_encrypt].sort().join('')).digest('hex')
    , pass = false
  // console.log(timestamp, nonce, dev_msg_signature, msg_signature)
  if(dev_msg_signature === msg_signature) pass = true
  return pass
}

module.exports = verifySignature