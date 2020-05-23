const express = require('express')
const serverless = require('serverless-http')
const app = express()
const port = process.env.PORT || 80
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const router = express.Router()

const User = require('./models/user')
const Inventory = require('./models/inventory')
const Ticket = require('./models/ticket')
const Program = require('./models/program')

const Accessory = require('./models/inv/accessory')
const Computer = require('./models/inv/computer')
const Cord = require('./models/inv/cord')

const Access = require('./models/ticket/access')
const Equipment = require('./models/ticket/equipment')
const Error = require('./models/ticket/error')
const Other = require('./models/ticket/other')
const Print = require('./models/ticket/print')
const NewUser = require('./models/ticket/user')
const Borrow = require('./models/ticket/borrow')

const routes = require('./routes/routes')
const config = require('./config/database')
const cookieParser = require('cookie-parser')
app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(80, function () {
  console.log('app is listening at port 80');
});
