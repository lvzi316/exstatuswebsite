var fs = require('fs');
var computeManagement = require('azure-asm-compute');
var config = require('./config.json');

var computeManagementClient = computeManagement.createComputeManagementClient(computeManagement.createCertificateCloudCredentials({
  subscriptionId: config.subscriptionId,
  pem: fs.readFileSync(config.managementcert, 'utf-8').toString()
}));


computeManagementClient.deployments.getByName(config.serviceName,config.deploymentName, function (err, result) {
  if (err) {
    console.log(err);
  }
  else{
    for (var i = 0; i < result.roleInstances.length; i++) {
      var instance = result.roleInstances[i];
      console.log("Virtual Machine status: " + instance.instanceStatus);
    }
  }
});