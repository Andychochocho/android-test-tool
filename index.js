var adb = require('adbkit')
var client = adb.createClient()
var fs = require('fs');
var home = require("os").homedir();
var logpath = home + '/Desktop/logcat.txt';

fs.writeFile(logpath, 'Hello world', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
        document.getElementById("demo").innerHTML = "Device " + device.id + " was plugged in";
    })
    tracker.on('remove', function(device) {
        document.getElementById("demo").innerHTML = "Device " + device.id + " was unplugged";
    })
    tracker.on('end', function() {
      console.log('Tracking stopped');
    })
  })
  .catch(function(err) {
    document.getElementById("demo").innerHTML = "Something went wrong: " + err.stack;
  })