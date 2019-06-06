var adb = require('adbkit')
var client = adb.createClient()

if (document.getElementById("demo").length === undefined) {
  document.getElementById("demo").innerHTML = "Please connect your device"
}

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