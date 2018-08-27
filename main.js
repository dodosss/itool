'use strict';

// 主进程
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')

const Menu = electron.Menu
require('./menu.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
//const Menu = electron.Menu;
const Tray = electron.Tray;

//托盘对象
var appTray = null;

function createWindow() {

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  //mainWindow.setMenu(null);

  // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
  // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
  mainWindow.on('close', (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });
  mainWindow.on('show', () => {
    appTray.setHighlightMode('always')
  })
  mainWindow.on('hide', () => {
    appTray.setHighlightMode('never')
  })

  // Emitted when the window is closed.
  //mainWindow.on('closed', function () {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  //mainWindow = null
  //})

  //mainWindow.webContents.executeJavaScript("document.getElementById('content').innerHTML = " + html)


  //系统托盘右键菜单
  var trayMenuTemplate = [
    /*{
        label: '设置',
        click: function () {} //打开相应页面
    },*/
    {
      label: '退出',
      click: function () {
        //ipc.send('close-main-window');
        mainWindow.destroy();
        app.quit();
      }
    }
  ];

  //系统托盘图标目录
  var trayIcon = path.join(__dirname, 'static/img');

  appTray = new Tray(path.join(trayIcon, 'icon.ico'));

  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('调试助手');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);

  
  appTray.on('click', () => { //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true);
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// 主进程与渲染进程的通信，其中一种，通过ipcMain和ipcRenderer对象，以消息的方式进行通信。 
const ipcMain = require('electron').ipcMain

// 
ipcMain.on('send-message', function (event) {
  console.log("send-message");
})

// 1-2、主进程如何向渲染进程发信息
// main.js
// 当页面加载完成时，会触发`did-finish-load`事件。
//mainWindow.webContents.on('did-finish-load', () => {
//  win.webContents.send('main-process-messages', 'webContents event "did-finish-load" called');
//});

// 2-2、渲染进程需要给主进程发生消息
ipcMain.on('asynchronous-message', (event, arg) => {
  // 返回消息
  event.sender.send('asynchronous-reply', 'ok');
});


// 打开新窗口的“最佳”做法(传送门: 相册Github)
// https://www.cnblogs.com/buzhiqianduan/p/7620099.html

ipcMain.on('newPage', function (e) {
  const modalPath = `file://${__dirname}/src/settings.html`
  let win = new BrowserWindow({
    width: 1024,
    height: 724,
    webPreferences: {
      webSecurity: false
    }
  })
  win.on('close', function () {
    win = null
  })
  win.loadURL(modalPath)
})