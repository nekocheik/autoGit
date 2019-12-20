let Path = require('path')
let fs = require('fs')
let child_process = require('child_process')

let addFolder = () => {
  
}


let updatedConfig = () => {
  
}


let removeFolder = () => {
  let newConfig = JSON.stringify(config.configToJson)
  console.log(newConfig)
  fs.writeFileSync(config.configFolder, newConfig)
}


let configPath = '/config/conf.json'

let fileConfig = 
JSON.parse(
            fs.readFileSync
            (
              Path.dirname(process.argv[1]) + configPath
            )
          )


let config = {
  baseName: Path.dirname(process.argv[1]),
  curentFolder: () => 'config/',
  commandParms: [
    ...process.argv.slice(2)
  ],
  pathOfTheConfig: configPath,
  configToJson : fileConfig,
}

config.configToJson.cheik = 'xcheik'

config.folderSave = `${config.baseName}/config/conf.json`

//console.log(config)

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

selectGodCommand(config.commandParms[0])


removeFolder()