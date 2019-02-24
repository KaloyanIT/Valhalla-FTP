const path = require('path');
const $ = require('jquery');
const { ipcRenderer } = require('electron');

let $lastClickedLi = '';


function readFilesOnPath(path) {
  ipcRenderer.send('getFilesForPath', path);
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
  console.log(elements);
  $lastClickedLi.append(elements);
});

function displayDrives(drives) {
  // let filesContainerClass = ".source-fileSystem";
  const directoriesUlClass = '.drives';

  console.log('display drives', drives);
  const element = createLiListForFileNames(drives);

  $(directoriesUlClass).html(element);
}

function createLiListForFileNames(fileNames) {
  let element = '';
  for (let i = 0; i < fileNames.length; i++) {
    const currName = fileNames[i];
	  element += createLiFileElement(currName, currName);
  }

  return element;
}

function createLiFileElement(path, displayName) {
  return `<li data-path="${path}">${displayName}</li>`;
}

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
  // readFilesOnPath(driveNames[0])
  displayDrives(driveNames);
}

$('.source-fileSystem').on('click', '.load-files-btn', loadFiles);

$('.drives').on('click', 'li', invokeDirectoryContent);
