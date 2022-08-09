/*

Ne pas modifier merci, j'ai pas le temps ni la patience de faire du support pour des versions modifiées du launcher.

note pour les cheaters eventuels ou les modders : on a des checks server sided, modifier le launcher seul ne marchera pas.

deuxième note : https://github.com/SomeBoringNerd, forkez, starrez ou partagez

dernière note : 2b2fr.xyz, serveur anarchie 1.19.1, NoChatReport (plugin custom)


























































































*/

// imports
const fs = require('fs')

const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const eapp = express()
const unzip = require('unzipper');
const getAppDataPath = require("appdata-path");

const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
const download = require('download');

// express pour workaround Electron qui ne communique pas avec Node
eapp.listen(55555, () => {})

eapp.get('/launch', async(req, res) => 
{
    console.log("path : " + getAppDataPath("surion-pvp"))

    if(!fs.existsSync(getAppDataPath("surion-pvp")))
    {
        // créé le dossier si besoin
        await fs.mkdir(getAppDataPath("surion-pvp"), (err) => {console.log(err)})
    }else
    {
        // supprime les mods / configs
        if(fs.existsSync(path.join(getAppDataPath("surion-pvp"), "mods")))
        {
            await fs.rm(path.join(getAppDataPath("surion-pvp"), "mods"), {recursive: true,}, (err) => {console.log(err)})
        }
        if(fs.existsSync(path.join(getAppDataPath("surion-pvp"), "config")))
        {
            await fs.rm(path.join(getAppDataPath("surion-pvp"), "config"), {recursive: true,}, (err) => {console.log(err)})
        }
    }

    // télécharge Forge et les rescources, puis extrait les rescources

    await download("http://files.surion-pvp.fr/forge.jar", getAppDataPath("surion-pvp"), (err) => {console.log(err)})
    await download("http://files.surion-pvp.fr/ressources.zip", getAppDataPath("surion-pvp"), (err) => {console.log(err)})
    await fs.createReadStream(path.join(getAppDataPath("surion-pvp") , "ressources.zip")).pipe(unzip.Extract({ path: getAppDataPath("surion-pvp") }));

    // prépare le lancement du jeu
    let opts = 
    {
        authorization: Authenticator.getAuth(req.query.player),
        
        version: {
            number: "1.12.2",
            type: "release"
        },
        forge: path.join(getAppDataPath("surion-pvp"), "forge.jar"),
        memory: {
            max: "6G",
            min: "4G"
        },
        root: getAppDataPath("surion-pvp"),
        maxSockets: 10
    }


    await launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
})

// Electron créé une page en 720p
function createWindow () 
{
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Surion-pvp",
        resizable:false,
        autoHideMenuBar: true,
        fullscreenable: false,
        fullscreen: false,
        webPreferences: 
        {
            nodeIntegration: true,
            preload: path.join(__dirname, "web" , 'preload.js')
        }
    })
  
    win.loadFile('web/index.html')
}


app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
        }
    })
    app.on("system-context-menu", (event, _point) => {
        event.preventDefault();
    });
})
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

