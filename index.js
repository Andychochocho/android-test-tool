const {shell} = require('electron');
const logcat = require('adbkit-logcat');
const {spawn} = require('child_process');
const Promise = require('bluebird');
const adb = require('adbkit');
const client = adb.createClient();
const recordScreen = require('adb-record-screen');
const fs = require('fs');
const path = require('path');
const home = require("os").homedir();
const fixPath = require('fix-path');

//fix Path variable since once packaged will be run as an application and not through command line
console.log(process.env.PATH);
fixPath();
console.log(process.env.PATH);
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
              android_version = properties["ro.build.version.release"];
              document.getElementById("device_info").innerHTML = "Device connected: " + properties["ro.product.model"] + " Android " + android_version;
              CreateReader(android_version);
              console.log(properties);
              document.getElementById("save_logs").style.pointerEvents = "auto";
              document.getElementById("capture_screen").style.pointerEvents = "auto";
              document.getElementById("video_screen").style.pointerEvents = "auto";
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
            document.getElementById("video_screen").style.pointerEvents = "none";
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

const CreateReader = function(android_version){

  // (change fixLineFeeds: false to true) for android 6 and lower
  var options = {
    fixLineFeeds: false,
  };

  if(parseInt(android_version) < 7){
    options.fixLineFeeds = true;
  }

  // Create reader from stream
  const proc = spawn('adb', ['logcat', '-B'], {
    shell: true,
    env: home + "/.android-sdk-macosx/platform-tools/"
  });
 
  reader = logcat.readStream(proc.stdout, options);

}

var running = false;
var button_click_el = document.getElementById('save_logs');

button_click_el.addEventListener('click', function() {

  //update logging status
  if(running === false){
    image_icons.src = "./images/stop_icon.png";
    running = true;

    // attach event handler to stream
    reader.on('entry', log_new_data = function(new_data) {
      fs.appendFile(logpath, new_data.message, function (err) {
        if (err) throw err;
      });
    });

    alert('Your logs are being saved!');

  }
  else{
    image_icons.src = "./images/save_icon.png";
    running = false;
    reader.off('entry', log_new_data);
    alert('Stopping feed!');
  }

  // Make sure we don't leave anything hanging
  process.on('exit', () => {
    proc.kill()
  })
}, false);

var screen_cap_button = document.getElementById('camera_icon');
//get a screenshot
screen_cap_button.addEventListener('click', function(){
  var scriptPath = path.join(__dirname, '/scripts/script.sh');
  console.log("Path: " + scriptPath);
  //spawn('sh', [scriptPath, home + "/Desktop/screen.png"]);adb shell screencap -p /sdcard/screencap.png

  client.listDevices()
    .then(function(devices) {
      return Promise.map(devices, function(device) {
        return client.screencap(device.id, function(err, screencap){
          var writeStream = fs.createWriteStream(home + "/Desktop/screen.png");
          screencap.pipe(writeStream);
        });
      })
    })
    .then(function() {
      console.log('Took screenshot')
    })
    .catch(function(err) {
      console.error('Something went wrong:', err.stack)
    })

  alert('Saving screenshot to ' + home + "/Desktop/screen.png");

});

var video_button = document.getElementById('video_icon');
var videoing = false;
var recording = null;
//start/stop screen recording
video_button.addEventListener('click', function(){

  if(videoing === false){
    recording = recordScreen(home + '/Desktop/video.mp4', {
      bugreport: false,
      waitTimeout: 5000,
      bitRate: 10000000,
      timeLimit: 180, // Time limit (s), maximum is 180 (3 mins)
      pullDelay: 200 // Delay (ms) before pulling the video file
    })
  }
  
  if(videoing === false){
    recording.promise
      .then(result => {
        // Screen recording is done
        process.stdout.write(result.stdout)
        process.stderr.write(result.stderr)
      })
      .catch(error => {
        // Screen recording has failed
        console.error(error)
      })

    video_icon.src = "./images/stop_icon.png";
    videoing = true;
    alert('Recording video!');
  }
  else{
    recording.stop();
    alert('Stopping video record! Saving to ' + home + '/Desktop/video.mp4');
    video_icon.src = "./images/video_icon.png"
    videoing = false;
  }
  
});

// hyperlink to readme file on github
var read_me = document.getElementById('readme');
read_me.addEventListener('click', function() {
  shell.openExternal('https://github.com/Andychochocho/android-test-tool/blob/master/README.md')
})