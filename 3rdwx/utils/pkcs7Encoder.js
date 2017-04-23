//pkcs7Encoder

var pkcs7Encoder = {
  //对需要加密的明文进行填充补位
  encode: function(text) {
    var blockSize = 32
    var textLength = text.length
    //计算需要填充的位数
    var amountToPad = blockSize - (textLength % blockSize)
    var result = new Buffer(amountToPad)
    result.fill(amountToPad)
    return Buffer.concat([text, result])
  },
  //删除解密后明文的补位字符
  decode: function(text) {
    var pad = text[text.length - 1]
    if (pad < 1 || pad > 32) {
        pad = 0
    }
    // console.log(pad)
    return text.slice(0, text.length - pad)
  }
}

module.exports = pkcs7Encoder