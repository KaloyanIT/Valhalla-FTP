const {app, BrowserWindow} = require('electron');

require('electron-reload')(__dirname, {
    electron: require(`../node_modules/electron`)
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 1200, height: 800 , webPreferences: {
      nodeIntegration: true
  }});

    mainWindow.loadFile('src/index.html');

    mainWindow.webContents.pre

    mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
  }

  app.on('ready', createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })