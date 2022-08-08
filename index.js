/*

Ne pas modifier merci, j'ai pas le temps ni la patience de faire du support pour des versions modifiées du launcher.

note pour les cheaters eventuels ou les modders : on a des checks server sided, modifier le launcher seul ne marchera pas.

deuxième note : https://github.com/SomeBoringNerd, forkez, starrez ou partagez

dernière note : 2b2fr.xyz, serveur anarchie 1.19.1, NoChatReport (plugin custom)


























































































*/

const fs = require('fs')

const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const eapp = express()

const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();

eapp.listen(55555, () => {})

eapp.get('/launch', (req, res) => {
    let opts = 
    {
        authorization: Authenticator.getAuth(req.query.player),
        
        version: {
            number: "1.12.2",
            type: "release"
        },
        forge: "./forge.jar",
        memory: {
            max: "6G",
            min: "4G"
        },
        root: './surion-pvp',
        maxSockets: 10
    }


    launcher.launch(opts);

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
})

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

