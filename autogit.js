let Path = require('path')
let fs = require('fs')
let child_process = require('child_process')
const EventEmitter = require('events');
let config = require('./config.js')
const myEmitter = new EventEmitter();

let converToMap = ( array) => 
{
  let newMap = new Map()
  array.forEach((valeur,i) => {
    newMap.set(i, valeur)
  });
  return newMap
}


checkIfFileExiste = ( path , cb) => {
  fs.exists( path , (exists) => {
    return cb(exists)
  });
}

let addFolder = ( folder = config.otherParms[0], loop = false ) => 
{
  let newPath = Path.resolve(config.folderCommandExec, folder)
  checkIfFileExiste(newPath, ( value )=>{
    let typeofFile = fs.statSync(newPath).isFile()
    if (value && !typeofFile) {
      config.configToJson.listOfFolderSave.push(newPath)
      if (!loop) {
        updatedConfig()
      }
    } else if ( typeofFile ) {
      console.error(`\n  ${newPath} the file does not a folder \n`)
    } else {
      console.error(`\n  ${newPath}  the file does not exist\n`)
    }
  })
}

addFolders = () => {
  let pathOfFolders = config.otherParms
  pathOfFolders.forEach( folder => {
    addFolder(folder)
  });
  updatedConfig()
}

let updatedConfig = () => 
{
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


// let configPath = process.mainModule.path +`/config/conf.json`
// let fileConfig = JSON.parse(fs.readFileSync(configPath))
// let argCommand = process.argv.slice(2)

// let config = {
//   baseName: Path.dirname(process.argv[1]),
//   actionParms: argCommand.slice(0,3),
//   otherParms: argCommand.slice(2),
//   folderCommandExec: process.env.PWD,
//   pathOfTheConfig: configPath,
//   configToJson : fileConfig,
//   allActionBydefault : []
// }




let actions = new Map([
  [ 'add', new Map([
      [
        'folder', new Map([['default', addFolder], ['-p', addFolders]])  
      ],
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
          ['-p', removeFolder]
      ]),
    ]
  ])]
]);

const SetAllActionBydefault =  function ( parm, action =  actions ) {
  if ( typeof action === "object" && action.has(parm)) {
    config.actionParms.splice(0,1)
    config.allActionBydefault.push(parm)
    SetAllActionBydefault(config.actionParms[0], action.get(parm))
  }
}
//select action
const selectGodCommand =  function ( parm = 'default', action =  actions ) {
  if (typeof action === "object" && action.has(parm)) {
    config.allActionBydefault.splice(0,1)
    selectGodCommand(config.allActionBydefault[0], action.get(parm))
  } else if (typeof action === 'function' ) {
    action()
  } else {
    console.log(action)
  }
}

SetAllActionBydefault(config.actionParms[0])
config.actionParms = config.allActionBydefault

// clean the parm if as more parms
if (config.allActionBydefault.length == 3) {
  config.otherParms.shift()
}
selectGodCommand(config.allActionBydefault[0])

