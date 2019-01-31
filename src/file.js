const path = require('path');
const fs = require('fs');
const drivelist = require('../node_modules/drivelist');

function loadFiles() {
    console.log("pehso");
    console.log(drivelist.list())
    getFiles();
    try {
        getDrives();
    }
    catch(err) {
        console.log(err)
    }
}

function getFiles() {
    fs.readdir('\\', function (err, items) { 
        console.log(items);
        console.log(__dirname)
        
     });
}

function getDrives() {
    drivelist.list(function () {
        // console.log('initi')
        // if(error) {
        //     console.log(error);
        // }

        // console.log(drives);
    })
}