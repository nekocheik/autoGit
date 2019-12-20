let Path = require('path')
let fs = require('fs')
let child_process = require('child_process')

let addFolder = () => {
  console.log(config)
  config.folderCommandExec
}


let updatedConfig = () => {
  let newConfig = JSON.stringify(config.configToJson, undefined, 2)
  fs.writeFileSync(config.pathOfTheConfig, newConfig)
}


let removeFolder = () => {

}


let configPath = process.mainModule.path +`/config/conf.json`

let fileConfig = 
JSON.parse(
            fs.readFileSync
            (
              configPath
            )
          )


let config = {
  baseName: Path.dirname(process.argv[1]),
  commandParms: [
    ...process.argv.slice(2)
  ],
  folderCommandExec: process.env.PWD,
  pathOfTheConfig: configPath,
  configToJson : fileConfig,
}


let actions = new Map([
  [ 'add', new Map([
      [
        'folder',
        new Map([
          ['default', addFolder],
          ['-p', null]
        ]),
      ],
      [
        'folders',
        new Map([
          ['default', addFolder],
          ['-p', null]
        ]),
      ]
    ]), 
  ],

  [ 'remove', new Map([
    [
      'folder',
      new Map([
          ['default', addFolder],
          ['-p', null]
      ]),
    ]
  ])]
]);

// select action

const selectGodCommand =  function ( parm = 'default', action =  actions ) {
  if ( typeof action === "object" && action.has(parm)) {
    config.commandParms.splice(0,1)
    selectGodCommand(config.commandParms[0], action.get(parm))
  } else if (typeof action === 'function' ) {
    action()
  } else {
    //console.log(actions)
  }
}



//updatedConfig()
//console.log(process.mainModule.path)
