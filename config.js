let Path = require('path')
let fs = require('fs')

let configPath = process.mainModule.path +`/config/conf.json`
let fileConfig = JSON.parse(fs.readFileSync(configPath))
let argCommand = process.argv.slice(2)

let config = {
  baseName: Path.dirname(process.argv[1]),
  actionParms: argCommand.slice(0,3),
  otherParms: argCommand.slice(2),
  folderCommandExec: process.env.PWD,
  pathOfTheConfig: configPath,
  configToJson : fileConfig,
  allActionBydefault : []
}

module.exports = config;