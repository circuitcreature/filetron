'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const fs = require('fs');

let mainWindow;
console.log(electron.app)
function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
			width: 1200,
			height: 600,
			'min-width': 970,
			'min-height': 600,
			center: true
		});
	mainWindow.setMenu(null);
	mainWindow.openDevTools();
	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	var webContents = mainWindow.webContents;
}
var files = {
	paths: []
};
var get_list = function(path, cb){
	var obj = {
		path: path,
		structure: path.split('/'),
		files: []
	};

	fs.readdir(path, function(err, items) {
		let lng = items.length;

		var is_dir = function(pi){
			var file = obj.files[pi];
			fs.stat(path+'/'+file.name, function(err, stats) {
				file.is_directory = (stats) ? stats.isDirectory() : false;
				if(pi == (lng - 1)){
					cb(files);
				}
			});
		};
		for(let pi = 0; pi < lng; pi++) {
			obj.files.push({
				name: items[pi]
			});
			is_dir(pi);
		}
		files.paths.push(obj);
	});
}

ipcMain.on('open',function(event, args){
	let grabber = function(path){
		get_list(path[0], function(res){
			event.sender.send('file_results',res);
		});
	};
	dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]}, grabber);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
	app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
	createWindow();
	}
});
