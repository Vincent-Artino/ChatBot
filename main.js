express = require('express');
https = require('https');
request = require('request');
var path = require('path')
var app = express();
port = Number(process.env.PORT || 5000);
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
var location = []
access_token="EAAa8OG0MJdoBANqxyDAcscCwHxaW5FIVKDr810uUE6ZBZB7aCoDn9VnpiPZB1JtVl2KYmQBMDbj2ySuQyw9DMP67TD5jyAlr2tbydxbhIGSZBygAZB3NkoTXQJZAZBo1ZCGsCG19ej9hOEK0GJNYKPFxk5SHZBL9V1GfChTvqJztDBQZDZD";
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'TheDreamOne') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});
app.listen(port)
