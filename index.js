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
              document.getElementById("device_info").innerHTML = "Device connected: " + properties["ro.product.model"] + " Android " + properties["ro.build.version.release"];
              console.log(properties);
              document.getElementById("save_logs").style.pointerEvents = "auto";
              document.getElementById("capture_screen").style.pointerEvents = "auto";
            }).catch(function(err){
              document.getElementById("device_info").innerHTML = err;
            })}, 500
          );  
        })
        tracker.on('remove', function(device) {
            //update status message and disable buttons after removing device
            document.getElementById("device_info").innerHTML = "Device not connected";
            document.getElementById("save_logs").style.pointerEvents = "none";
            document.getElementById("capture_screen").style.pointerEvents = "none";
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

var read_me = document.getElementById('readme');

var running = false;

// Connect logcat to the stream
reader = logcat.readStream(proc.stdout);
// attach event handler to stream
reader.on('entry', handleNewData => {
  if(running === true){
    fs.appendFile(logpath, handleNewData.message, function (err) {
      if (err) throw err;
    });
  }
  else{
    console.log("Log is not running");
  }
  
});

var button_click_el = document.getElementById('save_logs');

button_click_el.addEventListener('click', function() {

  //update logging status
  if(running === false){
    alert('Your logs are being saved!');
    image_icons.src = "./images/stop_icon.png"
    running = true;
  }
  else{
    alert('Stopping feed!');
    image_icons.src = "./images/save_icon.png"
    running = false;
  }

  // Make sure we don't leave anything hanging
  process.on('exit', () => {
    proc.kill()
  })
}, false);

var screen_cap_button = document.getElementById('camera_icon');

screen_cap_button.addEventListener('click', function(){
  alert('Saving screenshot');
  //run script file
  spawn('sh', ['script.sh', home + "/Desktop/screen.png"]);
});

var video_button = document.getElementById('video_icon');

screen_cap_button.addEventListener('click', function(){
  alert('Saving video');
  //run script file
  spawn('sh', ['script_video.sh', home + "/Desktop/screen.mp4"]);
});

// hyperlink to readme file on github
read_me.addEventListener('click', function() {
  shell.openExternal('https://github.com/Andychochocho/android-test-tool/blob/master/README.md')
})