var adb = require('adbkit')
var client = adb.createClient()
var fs = require('fs');
var home = require("os").homedir();
var logpath = home + '/Desktop/logcat.txt';

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

const logcat = require('adbkit-logcat')
const {spawn} = require('child_process')
 
// Retrieve a binary log stream
const proc = spawn('adb', ['logcat', '-B'])
 
// Connect logcat to the stream
reader = logcat.readStream(proc.stdout)
reader.on('entry', entry => {
  fs.appendFile(logpath, entry.message, function (err) {
    if (err) throw err;
  });
})

// Make sure we don't leave anything hanging
process.on('exit', () => {
  proc.kill()
})