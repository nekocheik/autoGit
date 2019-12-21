let Path = require('path')
let fs = require('fs')
const { spawn, spawnSync, exec } = require('child_process');
const {onExit} = require('@rauschma/stringio');
let child_process = require('child_process');
let config = require('./config')

config.configToJson.listOfFolderSave.forEach( pathFolder => {
  exec("git push",{ cwd: pathFolder },(err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
    console.log(`Number of files ${stdout}`)
  })
});

exec("git push", {cwd: '/Users/hetic/desktop/dev/TODO_REACT' },(err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(stdout)
})


// exec('cd | ls',{ cwd: '/Users/samer/Downloads' },(err, stdout, stderr) => {
//   if (err) {
//     console.error(`exec error: ${err}`);
//     return;
//   }

//   console.log(`Number of files ${stdout}`);
// });