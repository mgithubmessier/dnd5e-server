var express = require('express');
var cors = require('cors');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');

// setup
var app = express();

// constants
var dbURL = 'mongodb://localhost:27017';
var dbName = 'dnd5eDB';

var mongoConnection;


var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");    
  res.header("Access-Control-Allow-Headers", "http://localhost:4200");
  next();
});

function getMongoConnection() {
  if(!mongoConnection) {
    mongoConnection = mongodb.connect(dbURL);
  } 
  return mongoConnection;
}

app.post('/save', function (req, res, next) {
  getMongoConnection().then(function(client) {
      var db = client.db(dbName);
      if(req.body._id) {
        delete req.body._id;
      }
      db.collection('abilities').update({ "name":req.body.name }, req.body, function(error, result) {
        if(error) {
          console.error(error);
        } else {
          res.json({ msg: result });
        }
      });
  });
});

app.get('/get', function (req, res, next) {
  getMongoConnection().then(function(client) {
      var db = client.db(dbName);
      db.collection('abilities').find({}).toArray(function(error, result) {
        if(error) {
          console.error(error);
        } else {
          res.json(result);
        }
      });
  });
});

app.post('/login', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for only example.com.'})
});

app.listen(8080);
