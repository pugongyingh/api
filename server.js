const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')

const User = require('./models/user')
const Inventory = require('./models/inventory')
const Ticket = require('./models/Ticket')

const Accessory = require('./models/inv/Accessory')
const Computer = require('./models/inv/computer')
const Cord = require('./models/inv/Cord')

const Access = require('./models/ticket/Access')
const Equipment = require('./models/ticket/Equipment')
const Error = require('./models/ticket/Error')
const Other = require('./models/ticket/Other')
const Print = require('./models/ticket/Print')
const NewUser = require('./models/ticket/User')

const routes = require('./routes/routes')
const config = require('./config/database')
const cookieParser = require('cookie-parser')

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var corsOptions = {
  origin: ['http://ems.test', 'http://api.ems.test', 'http://localhost:3000', 'http://localhost:3001'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'token', 'admin', '*']
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(morgan('dev'))

routes(app);

app.listen(config.port);
