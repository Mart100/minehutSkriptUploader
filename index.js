#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const MinehutAPI = require('node-minehut-api')

const Minehut = new MinehutAPI()

program.version('1.0.2')

program
  .command('upload [file]')
  .option("-r, --reload", "Reload the skript ingame")
  .description('upload a specific file')
  .action((file, options) => {
    if(!file) console.log('Please specify a file')
    if(!file.endsWith(".sk")) file += '.sk'
    let options1 = {}
    if(options.reload) options1.reload = true
    let fullFile = process.cwd() + '\\' + file
    uploadSkriptToMinehut(fullFile, options1)

  })


program
  .command('watch [file]')
  .option("-r, --reload", "Reload the skript ingame")
  .description('Upload when file updates')
  .action((file, options) => {
    if(!file) console.log('Please specify a file')
    if(!file.endsWith(".sk")) file += '.sk'
    let fullFile = process.cwd() + '\\' + file
    let options1 = {}
    if(options.reload) options1.reload = true
    let lastSave = new Date().getTime()
    fs.watch(fullFile, async (event, filename) => {
      if(!filename) return
      let now = new Date().getTime()
      if(lastSave+250 > now) return
      lastSave = now
      console.log(`File ${filename} has updated. Uploading...`)
      await uploadSkriptToMinehut(fullFile, options1)
      
    })

  })
program
  .command('login [email] [password]')
  .description('Used to log into your account')
  .action(async (email, password, options) => {
    editConfigFile('email', email)
    await sleep(200)
    editConfigFile('password', password)
    await sleep(300)
    let config = await readConfigFile()
    try {
      let response = await Minehut.getLoginSession(config.email, config.password)
      console.log('\n Succesfully logged in!')
    } catch(e) {
      console.log('An error occured. These are probaly not valid login details.')
    }
  })

program.parse(process.argv)


async function editConfigFile(what, to) {
  return new Promise(async (resolve, reject) => {
    let json = await readConfigFile()
    json[what] = to
    fs.writeFile(__dirname+'\\config.json', JSON.stringify(json), 'utf8', (err) => {
      if(err) throw err;
      resolve()
    })
  })
}
async function readConfigFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname+'\\config.json', 'utf8', (err, data) => {
      if(err) throw err;
      resolve(JSON.parse(data))
    })
  })
}

async function getFileContents(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if(err) throw err
      resolve(data.toString('utf8'))
    })
  })
}

async function uploadSkriptToMinehut(fileLoc, options) {
  return new Promise(async (resolve, reject) => {

    if(!options) options = {}
    let skriptContent = await getFileContents(fileLoc)
    let config = await readConfigFile()
    if(config.email == "" || config.password == "") return console.log('Please login first using: mhsu login [email] [password]')
    await Minehut.getLoginSession(config.email, config.password)
    let user = await Minehut.getCurrentUser()
    let server = Minehut.server(user.servers[0])
    let fileLocSplit = fileLoc.split('\\')
    let fileName = fileLocSplit[fileLocSplit.length-1]
    await server.editFile(`plugins/Skript/scripts/${fileName}`, skriptContent)
    if(options.reload) {
      await sleep(200)
      await server.sendCommand(`skript reload ${fileName}`)
      server.sendCommand(`say [minehutSkriptUploader] Skript ${fileName} reloaded`)
    }

    console.log(`File ${fileName} successfully uploaded to MineHut`)
    resolve()
  })
}

async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}