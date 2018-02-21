var express = require('express');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

// setup
var app = express();

// constants
var dbURL = 'mongodb://localhost:27017';
var dbName = 'dnd5eDB';

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

app.post('/save', function (req, res, next) {
  MongoClient.connect(dbURL, function(error, client) {
    if(error) {
      console.error('SAVE Unable to connect to server');
    } else {
      console.log('SAVE connection established');
      var db = client.db(dbName);

      db.collection('abilities').update({ "name":req.body.name }, req.body,  function(error, result) {
        console.log('SAVE RESULT: ', result);
        res.header("Access-Control-Allow-Headers", "http://localhost:4200")
        res.json({
          msg: result
        });
        client.close();    
      });

    }
  });
});

app.get('/get', function (req, res, next) {
  MongoClient.connect(dbURL, function(error, client) {
    if(error) {
      client.close();    
      console.error('GET Unable to connect to server');
    } else {
      console.log('GET connection established');
      var db = client.db(dbName);
      db.collection('abilities').find({}).toArray(function(error, result) {
        res.json(result);
        client.close();    
      });
    }
  });
});



app.post('/login', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for only example.com.'})
});

app.listen(8080);
