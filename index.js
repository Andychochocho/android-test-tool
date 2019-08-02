const {shell} = require('electron');
const logcat = require('adbkit-logcat');
const {spawn} = require('child_process');
const adb = require('adbkit');
const fs = require('fs');
const home = require("os").homedir();
const client = adb.createClient();
const logpath = home + '/Desktop/logcat.txt';

try {
  // checks if folder exists for adb
  if (fs.existsSync(home + "/../../usr/local/Caskroom/android-platform-tools")) {
    if (document.getElementById("device_info").length === undefined) {
      document.getElementById("device_info").innerHTML = "Please connect your device"
    }
    client.trackDevices()
      .then(function(tracker) {
        tracker.on('add', function(device) {
          //give adb time to determine whether the device is authorized before attempting getProperties()
          setTimeout(function (){
            client.getProperties(device.id).then(function(properties){
              document.getElementById("device_info").innerHTML = "Device " + properties["ro.product.model"] + " is connected";
              document.getElementById("save_logs").style.pointerEvents = "auto";
            }).catch(function(err){
              document.getElementById("device_info").innerHTML = err;
            })}, 500
          );  
        })
        tracker.on('remove', function(device) {
            document.getElementById("device_info").innerHTML = "Device not connected";
            document.getElementById("save_logs").style.pointerEvents = "none";
        })
        tracker.on('end', function() {
          console.log('Tracking stopped');
        })
      })
      .catch(function(err) {
        document.getElementById("demo").innerHTML = "Something went wrong: " + err.stack;
      })    
  }
  else {
    document.getElementById("device_info").innerHTML = "ADB not detected!" + 
    "<br />" + "Please see install instructions in the Readme."
  }
} catch(err) {
  console.error(err)
}

// Change reader.js (fixLineFeeds: true to false) for newer android devices  
// Retrieve a binary log stream

const proc = spawn('adb', ['logcat', '-B'], {
  shell: true,
  env: home + "/.android-sdk-macosx/platform-tools/"
});

var button_click_el = document.getElementById('save_logs');
var read_me = document.getElementById('readme');

button_click_el.addEventListener('click', function() {
  alert('Your logs are being saved!');
}, false);

button_click_el.addEventListener('click', function() {
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
}, false);

// hyperlink to readme file on github
read_me.addEventListener('click', function() {
  shell.openExternal('https://github.com/Andychochocho/android-test-tool/blob/master/README.md')
})