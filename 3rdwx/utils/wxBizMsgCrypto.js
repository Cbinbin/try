const crypto = require('crypto')
  , pkcs7Encoder = require('./pkcs7Encoder')

class wxBizMsgCrypto {
  constructor(encodingAesKey, appId) {
    if(!encodingAesKey || !appId) {
      throw new Error('please check arguments')
    }
    var AESKey = new Buffer(encodingAesKey + '=', 'base64')
    if(AESKey.length !== 32) {
      throw new Error('encodingAESKey invalid')
    }
    this.AESKey = AESKey
    this.iv = AESKey.slice(0, 16)
    this.appId = appId
  }

  encryptMsg(text) {
    // 获取16B的随机字符串
    var randomString = crypto.pseudoRandomBytes(16)
      , msg = new Buffer(text)
      , id = new Buffer(this.appId)
    // 获取4B的内容长度的网络字节序
    var msgLength = new Buffer(4)
    //写入无符号32位整型，大端对齐
    msgLength.writeUInt32BE(msg.length, 0)
    var bufMsg = Buffer.concat([randomString, msgLength, msg, id])
    // 对明文进行补位操作
    var encoded = pkcs7Encoder.encode(bufMsg)
    var cipher = crypto.createCipheriv('aes-256-cbc', this.AESKey, this.iv);
    cipher.setAutoPadding(false)
    var cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()])
    // 返回加密数据的base64编码
    return cipheredMsg.toString('base64')
  }

  decryptMsg(resXml) {
    var msg_encrypt = resXml.encrypt
    try {
      var decipher = crypto.createDecipheriv('aes-256-cbc', this.AESKey, this.iv)
      decipher.setAutoPadding(false)
      //Buffer.concat() 缓冲区合并
      var deciphered = Buffer.concat([decipher.update(msg_encrypt, 'base64'), decipher.final()])
      deciphered = pkcs7Encoder.decode(deciphered)
      var content = deciphered.slice(16)
        , length = content.slice(0, 4).readUInt32BE(0)
    } catch (err) {
      throw new Error(err)
    }
    return {
        msgXml: content.slice(4, length + 4).toString(),
        appid: content.slice(length + 4).toString()
    }
  }
}

module.exports = wxBizMsgCrypto