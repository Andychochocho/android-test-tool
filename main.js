const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 480,
    height: 300,
    show: false,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  win.once('ready-to-show', () => {
    win.show();
  });

  //when window is about to be closed
  win.on('close', (event) => {
      
  });

  //after window has been destroyed
  win.on('closed', () => {
    win = null;
  });

  // win.on('activate', () => {
  //   win.restore();
  //   win.focus();
  //   win.show();
  // });

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

//after selecting app from MacOS dock
app.on('activate', (event) => {
  if(win === null){
    createWindow();
  }
});