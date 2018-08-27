'use strict';

const { Menu, dialog, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

const dayjs = require('dayjs');

const template = [
    {
        label: '查看',
        submenu: [
            /*{
                label: '竖屏',
                type: 'radio', 
                checked: true,
                click: () => {
                    const win = BrowserWindow.fromId(1);
                    win.setSize(390,672);
                    win.webContents.send('change_event','vertical');
                }
            },
            {
                label: '横屏', 
                type: 'radio', 
                checked: false,
                click: () => {
                    const win = BrowserWindow.fromId(1);
                    win.setSize(670,460);
                    win.webContents.send('change_event','horizontal');
                }
            },
            {type: 'separator'},*/
            { label: '重载', role: 'reload' },
            { label: '退出', role: 'quit' },
        ]
    },
    {
        label: '帮助',
        submenu: [

            {
                label: '测试日志',
                click: () => {
                    var logtxt = "https://github.com/dodosss/device-dev-helper/debug_" + dayjs().format('YYYYMMDD') + ".txt";
                    shell.openExternal(logtxt);
                }
            },
            {
                label: 'websocket',
                click: () => {
                    shell.openExternal('https://github.com/dodosss/device-dev-helper');
                }
            },
            { type: 'separator' },
            {
                label: '关于',
                click: () => {
                    const win = BrowserWindow.fromId(1);
                    let about = new BrowserWindow({
                        parent: win,
                        modal: true,
                        width: 500,
                        height: 300,
                        minimizable: false,
                        maximizable: false,
                        resizable: false,
                        title: '关于'
                    })

                    about.loadURL(url.format({
                        pathname: path.join(__dirname, './src/about.html'),
                        protocol: 'file',
                        slashes: true
                    }));
                    // about.webContents.openDevTools();
                    about.setMenu(null);
                    about.once('ready-to-show', () => {
                        about.show();
                    })
                }
            }
        ]
    }
]
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);