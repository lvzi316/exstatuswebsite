var https = require('https');
var querystring = require('querystring');
var fs = require('fs');
var computeManagement = require('azure-asm-compute');
var config = require('./config.json');

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
var payloadobj = JSON.parse(payload);

function sendMessage(passpaylod, token) {
    console.log('token in send:', token);
    var sendMessagePath = '/cgi-bin/message/send?' + querystring.stringify({access_token:token});
    sendhttpoptions.path = sendMessagePath;

        
    sendhttpoptions.headers = {
        "Content-Type":'application/json',
        "Content-Length":passpaylod.length        
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
    
    req.write(passpaylod + '\n');
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

function monitor(updateTokenfunc) {
    var computeManagementClient = computeManagement.createComputeManagementClient(computeManagement.createCertificateCloudCredentials({
      subscriptionId: config.subscriptionId,
      pem: fs.readFileSync(config.managementcert, 'utf-8').toString()
    }));
        
    computeManagementClient.deployments.getByName(config.serviceName,config.deploymentName, function (err, result) {
      if (err) {
        console.log("error in get azure status.");
        console.log(err);
      }
      else{
        for (var i = 0; i < result.roleInstances.length; i++) {
          var instance = result.roleInstances[i];
          console.log("Virtual Machine status: " + instance.instanceStatus);
          var title = "Virtual Machine status: ";
          payloadobj.text.content = title.concat(instance.instanceStatus);
        }
        
        console.log("payload: " + JSON.stringify(payloadobj));
        updateTokenfunc('wx5ae0e14195a4e9d0','C69nX2JrQFmBAYeKdw7g91-1xl-TJWQuZZU6r6BaGMdIzUlzahwQvfThyXx4Y4DN', payloadobj, sendMessage);
      }
    });
}

monitor(Trigger);




