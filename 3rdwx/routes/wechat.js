const router = require('express').Router()
  , request = require('superagent')

router.get('/', (req, res)=> {
  console.log(req.body)
  request.post('b671ad43.ngrok.io/wechat/accept')
  .send({weixin: req.body})
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