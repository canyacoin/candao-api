// libs
const app = require('express')();
const cors = require('cors');
const functions = require('firebase-functions');

const admin = require('firebase-admin');

// load from config file or env vars
global.configs = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'DEFAULT_TOKEN_SECRET'
}

// Firebase supports Node 6.11.5 which doesn't has Object.values 
const getObjectValues = obj => obj ? Object.keys(obj).map(prop => obj[prop]) : [];
Object['values'] = Object['values'] || getObjectValues;

//init
admin.initializeApp();

global.fsAdmin = admin;

const corsOptions = {
  origin: [/localhost/, /candao/],
  methods: ['GET', 'PUT', 'POST']
};

app.use(cors(corsOptions));
app.use(require('./middleware/responses'));

require('./controllers/user/user.controller')(app);
require('./controllers/client/client.controller')(app);

exports.api = functions.https.onRequest(app);
