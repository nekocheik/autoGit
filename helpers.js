let checkArgsExist = (object, args) => {
  args.forEach( arg => {
    if (object[arg]) {
      return true
    }
  });  
}

let checkArgExist = (object, arg) => {
  if (object[arg]) {
    return true
  }  
}



export {checkArgsExist, checkArgExist}