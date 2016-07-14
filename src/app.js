const ipcMain = require('electron').ipcMain;

ipcMain.on('open',function(event, args){
	event.sender.send('open',res);
});
