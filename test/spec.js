const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

// describe('Application launch', function () {
//   this.timeout(10000)

  // beforeEach(function () {
  //   this.app = new Application({
  //     // Your electron path can be any binary
  //     // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
  //     // But for the sake of the example we fetch it from our node_modules.
  //     path: electronPath,

  //     // The following line tells spectron to look and use the main.js file
  //     // and the package.json located 1 level above.
  //     args: [path.join(__dirname, '..')]
  //   })
  //   return this.app.start()
  // })

  // afterEach(function () {
  //   if (this.app && this.app.isRunning()) {
  //     return this.app.stop()
  //   }
  // })

//   it('shows an initial window', function () {
//     return this.app.client.getWindowCount().then(function (count) {
//       assert.equal(count, 1)
//     })
//   })
// })

describe('Device id', function () {
  var adb = require('adbkit')
  var client = adb.createClient()
  this.timeout(15000)

  beforeEach(function () {
    this.app = new Application({
      path: electronPath,

      args: [path.join(__dirname, '..')]
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  /// make sure to use the Galaxy S9 Android 8.0 A Annex to test this
  it('show device id', function () {
    client.trackDevices()
      .then(function(tracker) {
        tracker.on('add', function(device) {
          return device.id;
          assert.equal(device.id, "4e554b4432573398")
        })
      })
  })
})

