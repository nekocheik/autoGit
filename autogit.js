let Path = require('path')
let fs = require('fs')
let child_process = require('child_process')
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

let converToMap = ( array) => 
{
  let newMap = new Map()
  array.forEach((valeur,i) => {
    newMap.set(i, valeur)
  });
  return newMap
}


let addFolder = () => 
{
  let newPath = Path.resolve(config.folderCommandExec, config.otherParms[0])
  config.configToJson.listOfFolderSave.push(newPath)
  updatedConfig()
}


let updatedConfig = () => 
{
  console.log(config.configToJson, config.pathOfTheConfig)
  let newConfig = JSON.stringify(config.configToJson, undefined, 2)
  fs.writeFileSync(config.pathOfTheConfig, newConfig)
}

setListFolderSave = (consoleLog = false) => 
{
  let list = config.configToJson.listOfFolderSave.map
  (
    (path, i)  => 
    [i, path]
  )
  if (consoleLog) {
    console.log(list)
  }
  return list
}


let removeFolder = (Allindex = config.otherParms) => 
{
  let listOfFolderSave = config.configToJson.listOfFolderSave
  let pathOfFolderRemove = []

  console.log(Allindex)

  listOfFolderSave = config.configToJson.listOfFolderSave.filter(
    (path, i) => 
    {
      pathOfFolderRemove.push(path)
      if ((typeof Allindex === 'object' && !converToMap(Allindex).has(i) )
      || (typeof Allindex === 'number' && Allindex != i )
      || (typeof Allindex === 'string' && (Allindex != path && Number(Allindex) !== i))
      && Allindex !== '*' ) {
        pathOfFolderRemove.splice( pathOfFolderRemove.indexOf(path), 1 );
        return path
      }
    }
  )
  console.log(`folder save :`,listOfFolderSave,  `folder remove :`,pathOfFolderRemove  )
  config.configToJson.listOfFolderSave = listOfFolderSave
  updatedConfig()
}


let configPath = process.mainModule.path +`/config/conf.json`
let fileConfig = JSON.parse(fs.readFileSync(configPath))
let argCommand = process.argv.slice(2)

let config = {
  baseName: Path.dirname(process.argv[1]),
  actionParms: argCommand.slice(0,2),
  otherParms: argCommand.slice(2),
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

  [ 'list', new Map([
    ['default', ()=>{
      setListFolderSave(true)
    }]
  ])],

  [ 'remove', new Map([
    [
      'folder',
      new Map([
          ['default', removeFolder],
          ['-p', null]
      ]),
    ]
  ])]
]);

//select action

const selectGodCommand =  function ( parm = 'default', action =  actions ) {
  if ( typeof action === "object" && action.has(parm)) {
    config.actionParms.splice(0,1)
    selectGodCommand(config.actionParms[0], action.get(parm))
  } else if (typeof action === 'function' ) {
    action()
  } else {
    console.log(actions)
  }
}

selectGodCommand(config.actionParms[0])

//updatedConfig()
//console.log(process.mainModule.path)
