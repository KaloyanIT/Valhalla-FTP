const path = require("path");
const fs = require("fs");
const util = require("util");
let spawn = require("child_process").spawn;

let rootDirs = [];

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
