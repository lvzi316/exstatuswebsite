var fs = require('fs');
var computeManagement = require('azure-asm-compute');

var computeManagementClient = computeManagement.createComputeManagementClient(computeManagement.createCertificateCloudCredentials({
  subscriptionId: '0d143eda-d5b8-44df-82ec-95c50895ff80',
  pem: fs.readFileSync('chaopandevsub.pem', 'utf-8').toString()
}));

var serviceName = "HD-sch-test";
var deploymentName = "f0ac5783-34b8-4e1a-be0a-cf4e824a2f0e";

computeManagementClient.deployments.getByName(serviceName,deploymentName, function (err, result) {
  if (err) {
    console.log(err);
  }
  else{
    console.log(result);
  }
});