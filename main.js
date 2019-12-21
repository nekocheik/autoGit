let Path = require('path')
let fs = require('fs')
const { spawn, spawnSync, exec } = require('child_process');
const {onExit} = require('@rauschma/stringio');
let child_process = require('child_process');
let config = require('./config')

exec('cd | ls', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  console.log(`Number of files ${stdout}`);
});