var https = require('https');
var querystring = require('querystring');

var sendhttpoptions = {
  method:'POST',
  hostname:'qyapi.weixin.qq.com',
  port:443
};

var getTokenHttpOptions = {
  method:'Get',
  hostname:'qyapi.weixin.qq.com',
  port:443  
};

var payload = '{"touser":"@all", "msgtype":"text","agentid":"3", "text": {"content":"check status"}}';

function sendMessage(passpaylod, token) {
    console.log('token in send:', token);
    var sendMessagePath = '/cgi-bin/message/send?' + querystring.stringify({access_token:token});
    sendhttpoptions.path = sendMessagePath;

    var payloadobj = JSON.parse(passpaylod);
    console.log(JSON.parse(passpaylod).text.content);
    var date = new Date();
    payloadobj.text.content = "Check Service Status: " + date.getHours();
    var sendpayload = JSON.stringify(payloadobj);
        
    sendhttpoptions.headers = {
        "Content-Type":'application/json',
        "Content-Length":sendpayload.length        
    };
    
    var req = https.request(sendhttpoptions, function(res) {
        console.log("statusCode:", res.statusCode);
        res.on('data', function(data) {
            console.log(data.toString());
            var result = JSON.parse(data.toString());
            console.log(result.errcode);
        }); 
    });
    
    req.on('error', function(error){
        console.log("error happened.");
        console.error(error.message);
        console.log(error);
    });
    
    req.write(sendpayload + '\n');
    req.end();
    
}

function Trigger(appId, secret, sendpayload, sendfunc) {
    getTokenHttpOptions.path = '/cgi-bin/gettoken?' + querystring.stringify({
        corpid:appId, corpsecret:secret});
    var req = https.request(getTokenHttpOptions, function(res) {
        console.log("statusCode:", res.statusCode);
        res.on('data', function(data) {
            console.log(data.toString());
            var tokenobj = JSON.parse(data.toString());
            console.log("token in get:", tokenobj.access_token);
            sendfunc(sendpayload, tokenobj.access_token);
        }); 
    });
    req.on('error', function(error){
        console.log("error happened.");
        console.error(error.message);
        console.log(error);
    });
    
    req.end();
}

Trigger('wx5ae0e14195a4e9d0','C69nX2JrQFmBAYeKdw7g91-1xl-TJWQuZZU6r6BaGMdIzUlzahwQvfThyXx4Y4DN', payload, sendMessage);




