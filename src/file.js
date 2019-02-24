const path = require("path");
const fs = require("fs");
const util = require("util");
const $ = require('jquery')
let spawn = require("child_process").spawn;
console.log(path.resolve('This PC'))
var os = require("os");
var root = (os.platform() == "win32") ? process.cwd().split(path.sep)[0] : "/"
console.log(root);
// let rootDirs = [];
let rootDirs = [];
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
    elements += `<li data-path="${currPath}">${args[i]}</li>`
  }
  elements += '</ul>';
  console.log(elements)
  $lastClickedLi.append(elements);


})

function displayDrives(drives) {
  let filesContainerClass = ".source-fileSystem";
  let directoriesUlClass = '.drives';

  console.log('display drives', drives);
	let element = ''
  for(let i = 0; i < drives.length; i++) {
	  element += `<li data-path="${drives[i]}">${drives[i]}</li>`
  }

  $(directoriesUlClass).html(element)
}

function getFiles() {
  fs.readdir("\\", function(err, items) {
    console.log(items);
    console.log(__dirname);
  });
}

function getDrives() {}
