'use strict';

// 渲染进程
// 在渲染进程中，直接调用原生的GUI接口是十分危险而且容易造成资源泄露。如果你想在渲染进程中使用原生的GUI的功能，需要让渲染进程与主进程进行通信，再由主进程去调用对应接口。
// 在渲染进程中不能直接访问菜单，对话框等，它们只存在于主进程中，但可以通过remote来使用这些资源 https://www.jianshu.com/p/57d910008612
// 在 Electron，我们提供用于在主进程与渲染进程之间通讯的 ipc 模块。并且也有一个远程进程调用风格的通讯模块 remote。 https://segmentfault.com/a/1190000005692430


// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


//module import

// renderer.js
// 引入ipcRenderer对象
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

// https://segmentfault.com/a/1190000006207600
// 1-1、主进程如何向渲染进程发信息
// 设置监听
ipcRenderer.on('main-process-messages', (event, message) => {
	console.log('message from Main Process: ', message);  // Prints Main Process Message.
});

// 2-1、渲染进程需要给主进程发生消息
ipcRenderer.on('asynchronous-reply', (event, arg) => {
	console.log('asynchronous-reply: %O %O', event, arg);
});
ipcRenderer.send('asynchronous-message', 'hello');





var content = document.getElementById("content");
var btn_send = document.getElementById("btn_send");


// 监听
btn_send.addEventListener("click", function () {
	ipcRenderer.send('send-message');
	ipcRenderer.send("newPage");
}, false);

// 显示
//document.getElementById("content").innerHTML = getTables();

//getTables();



function getTables() {
	// https://www.npmjs.com/package/mysql#introduction
	// npm install mysql
	///*	
	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'nongbo'
	});

	var txt = "";

	connection.connect();
	var sql = "SELECT * FROM `nb_device` LIMIT 0, 1000";
	//sql = "SELECT TABLE_NAME, TABLE_COMMENT FROM information_schema.TABLES WHERE table_schema = `nongbo` ORDER BY TABLE_NAME ASC";
	connection.query(sql, function (error, results, fields) {
		if (error) throw error;
		for (var i = 0, length = results.length; i < length; i++) {
			//console.log('The device: ', results[i].id + ' # ' + results[i].physical_sn);
			txt += results[i].id + " # " + results[i].physical_sn;
			txt += results[i].TABLE_NAME + " # " + results[i].TABLE_COMMENT;
		}
		document.getElementById("content").innerHTML = txt;
		//console.log(txt);
	});
	connection.end();
	return txt;
	//*/
}