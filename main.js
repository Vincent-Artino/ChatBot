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
var GetStartedButton = {
  "get_started":{
    "payload":"Get started"
  }
}
threadSetUp(GetStartedButton)
webViewSetUp()
function receivedMessage(event){
	var message = event.message;
	var senderID = event.sender.id;
	var messageText = message.text;
	var messageAttachments = message.attachments 
	console.log(messageAttachments)
	if(messageText){
		console.log("hey")
		var attach = {
                  type:"template",
                     payload:{
                        template_type:"button",
                        text:"Need further assistance? Talk to a representative",
                        buttons:[
                           {
                                "type":"web_url",
                                "url":"https://the-dream-app.herokuapp.com/",
                                "title":"View Item",
                                "webview_height_ratio": "compact"
                           }
                        ]
                     }
                }
        sendAttachment(attach)

	}
	else{
	console.log(event)
	}
}

function webViewSetUp(){
var data = {"whitelisted_domains":[
    "https://the-dream-app.herokuapp.com/"
  ]}
request({
		uri: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+access_token,
		method: 'POST',
		json : data
	},function (error,response,body){
		if(!error){
			console.log(body)
		}	
	});
}

function threadSetUp(messageData){
request({
	uri: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+access_token,
    	method: 'POST',
    	json: messageData
	
},function (error,response,body){
	if(!error){
		console.log("set up complete "+JSON.stringify(body));	
	}	
});
}

function sendAttachment(recID,attach){
	var messageData = {
	recipient : {
		id : recID	
	},
	message : {
		attachment :attach
	}
}
	console.log("attaching : "+attach);
	sendMessage(messageData);

}
function sendMessage(messageData){
request({
	uri: 'https://graph.facebook.com/v2.6/me/messages',
  	qs: { access_token: access_token },
    	method: 'POST',
    	json: messageData
	
},function (error,response,body){
	if(!error){
		console.log("message sent");	
	}	
});
}
app.listen(port)
