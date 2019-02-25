const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

require('electron-reload')(__dirname, {
  electron: require('../node_modules/electron'),
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('src/index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('getDriveList', (event) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const drives = [];

  // windows
  for (let i = 0; i < alphabet.length; i++) {
    const driveName = `${alphabet[i].toUpperCase()}:\\`;

    if (fs.existsSync(driveName)) {
      drives.push(driveName);
    }
  }

  event.returnValue = drives;
});


ipcMain.on('getFilesForPath', (event, args) => {
  const currPath = args;

  fs.readdir(currPath, (err, files) => {
    event.sender.send('getFilesForPathReply', files);
  });
});
