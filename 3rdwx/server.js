const express = require('express')
  , Logger = require('./log4.js').getLogger('__filename')
  , app = express()

require('./mongodb')
require('dotenv').config()

const port = process.env.PORT
  , routes = require('./routes')

const cors = require('cors')
  , bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/logs', express.static('logs'))

require('body-parser-xml')(bodyParser)
app.use(bodyParser.xml({
  limit: '2MB',
  xmlParseOptions: {
    normalize: true,
    normalizeTags: true,
    explicitArray: false
  }
}))

app.use('/', routes.home)
app.use('/wechat', routes.wechat)

app.listen(port, ()=> {
  console.log('Server is ruuning on port: ' + port)
  console.log('Use Ctrl-C to stop')
})