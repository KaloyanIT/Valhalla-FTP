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

new Promise(function (resolve, reject) {  
	let list = spawn("cmd");

	list.stdout.on("data", function(data) {
	  rootDirs.push(data.toString());
	  
	  console.log("stdout: " + data);
	});
  
	list.stdin.write("wmic logicaldisk get name\n");
	list.stdin.end();

	setTimeout(() => {
		resolve(rootDirs)
	}, 3000)

	// resolve(rootDirs)
}).then(function (rootDirs) { 
	let filesContainerClass = ".source-fileSystem";
  let directoriesUlClass = '.drives';

  console.log('display drives', rootDirs);
	let element = ''
  for(let i = 0; i < rootDirs.length; i++) {
	  element += `<li>${rootDirs[i]}</li>`
  }

  $(directoriesUlClass).html(element)
 });

function loadFiles() {
  let list = spawn("cmd");

  list.stdout.on("data", function(data) {
	rootDirs.push(data);
	
    console.log("stdout: " + data);
  });

  list.stdin.write("wmic logicaldisk get name\n");
  list.stdin.end();
  

  displayDrives(rootDirs);
}

function displayDrives(drives) {
  let filesContainerClass = ".source-fileSystem";
  let directoriesUlClass = '.drives';

  console.log('display drives', drives);
	let element = ''
  for(let i = 0; i < drives.length; i++) {
	  element += `<li>${drives[i]}</li>`
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
