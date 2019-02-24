const path = require('path');
const fs = require('fs');
const $ = require('jquery')
let $lastClickedLi = ''
const { ipcRenderer } = require('electron')

$('.source-fileSystem').on('click', '.load-files-btn', loadFiles);

$('.drives').on('click', 'li', invokeDirectoryContent)

function invokeDirectoryContent(ev) {   
  var filePath = $(ev.target).attr('data-path');
  $lastClickedLi = $(ev.target);
  
  console.log('hasChildren', $lastClickedLi.children().length > 0)
  if($lastClickedLi.children().length > 0) {
    console.log()
    for(let i = 0; i < $lastClickedLi.children().length; i++) {
      let child = $lastClickedLi.children()[i];
      console.log(child)
      child.remove();
    }
  }
  else {
    readFilesOnPath(filePath);
  }

 }


function loadFiles() {  
  var driveNames = ipcRenderer.sendSync('getDriveList', '') 
  // readFilesOnPath(driveNames[0])
  displayDrives(driveNames)
}

function readFilesOnPath(path) {
   ipcRenderer.send('getFilesForPath', path);
}

ipcRenderer.on('getFilesForPathReply', (event, args) => {
  let elements = '<ul>'

  if(!args) {
    return;
  }
  
  for(let i = 0; i < args.length; i++) {
    let currPath = path.join($lastClickedLi.data('path'), args[i])
    elements += createLiFileElement(currPath, args[i])
  }
  elements += '</ul>';
  console.log(elements)
  $lastClickedLi.append(elements);


})

function displayDrives(drives) {
  let filesContainerClass = ".source-fileSystem";
  let directoriesUlClass = '.drives';

  console.log('display drives', drives);
	let element = createLiListForFileNames(drives);

  $(directoriesUlClass).html(element)
}

function createLiListForFileNames(fileNames) {
  let element = '';
  for(let i = 0; i < fileNames.length; i++) {
    let currName = fileNames[i];
	  element += createLiFileElement(currName, currName)
  }

  return element;
}

function createLiFileElement(path, displayName) {
  return `<li data-path="${path}">${displayName}</li>`
}