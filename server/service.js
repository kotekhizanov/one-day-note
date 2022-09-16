var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'OneDayNote',
  description: 'One day note server service.',
  script: 'D:\\Projects\\one-day-note\\server\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();