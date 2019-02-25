const path = require('path');
const $ = require('jquery');
const { ipcRenderer } = require('electron');
const jsftp = require('jsftp');

let $lastClickedLi = '';


function readFilesOnPath(filePath) {
  ipcRenderer.send('getFilesForPath', filePath);
}

function createLiFileElement(filePath, displayName) {
  return `<li data-path="${filePath}">${displayName}</li>`;
}

function createLiListForFileNames(fileNames) {
  let element = '';
  for (let i = 0; i < fileNames.length; i++) {
    const currName = fileNames[i];
    element += createLiFileElement(currName, currName);
  }

  return element;
}

function displayDrives(drives) {
  const directoriesUlClass = '.drives';
  console.log(drives)

  const element = createLiListForFileNames(drives);

  $(directoriesUlClass).html(element);
}

ipcRenderer.on('getFilesForPathReply', (event, args) => {
  let elements = '<ul>';

  if (!args) {
    return;
  }

  for (let i = 0; i < args.length; i++) {
    const currPath = path.join($lastClickedLi.data('path'), args[i]);
    elements += createLiFileElement(currPath, args[i]);
  }
  elements += '</ul>';
  $lastClickedLi.append(elements);
});

function invokeDirectoryContent(ev) {
  const filePath = $(ev.target).attr('data-path');
  $lastClickedLi = $(ev.target);

  if ($lastClickedLi.children().length > 0) {
    for (let i = 0; i < $lastClickedLi.children().length; i += 1) {
      const child = $lastClickedLi.children()[i];
      child.remove();
    }
  } else {
    readFilesOnPath(filePath);
  }
}

function loadFiles() {
  const driveNames = ipcRenderer.sendSync('getDriveList', '');
  displayDrives(driveNames);
}

$('.source-fileSystem').on('click', '.load-files-btn', loadFiles);

$('.drives').on('click', 'li', invokeDirectoryContent);

const quickContainerClass = '.quick-connect-container';
const usernameInputClass = '.qc-username';
const passwordInputClass = '.qc-password';
const hostInputClass = '.qc-host';
const portInputClass = '.qc-port';
const quickButtonClass = '.qc-btn';

function validatePort(port) {
  const portNumber = parseInt(port, 10);

  if (portNumber < 0 || portNumber > 65535) {
    return false;
  }

  return true;
}

function quickConnectEvent(ev) {
  const username = $(usernameInputClass).val();
  const host = $(hostInputClass).val();
  const port = $(portInputClass).val();
  const password = $(passwordInputClass).val();

  //Validation
  if(!validatePort(port)) {
    //add validation
  }

  let data = {
    host,
    user: username,
    pass: password,
    port
  };

  const Ftp = new jsftp(data)

  let files = [];
  Ftp.ls('.', (err, res) => {
    // files.push(file.name);
    console.log(err)
    res.forEach((file) => {
      files.push(file.name)
      console.log(file.name)
    });
  });

    console.log('files', files);
  const elements = createLiListForFileNames(files);
  console.log(elements)

  $('.drives').html(elements)

}

$(quickContainerClass).on('click', quickButtonClass, quickConnectEvent);