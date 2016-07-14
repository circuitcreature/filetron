'use strict';

var ipc = require('electron').ipcRenderer;
var React = require('react');
var Dom = require('react-dom');

var model = function(){
	var self ={
		render: function() {
			return React.createElement("div", null, "Hello ", this.props.name);
		}
	}
	self.hydrate = function(_d){

	}
	self.class = React.createClass(self)
	self.render = function(){

	}
	return self;
}

var init = function(){
	Dom.render(
		React.createElement(Hello, {name: "World"}),
		document.getElementById('container')
	);
}

var self = {
	files: ko.observableArray(),
	loading: ko.observable()
};
var hash_edit = {
	//lets keep indexes of files that changed
	///of just a boo in th emodel
};
var model = function(data){
	let self = {
		name: '',
		name_new:'',
		path:'',
	}
	for(let pi = 0; pi < self.length; pi++){
		if(data.hasOwnProperty(pi)){
			self[pi] = data[pi];
		}
	}
	self.validate = function(){
		for(let pi = 0; pi < self.length; pi++){
			if(data.hasOwnProperty(pi)){
				self[pi] = data[pi];
			}
		}
	};
	return self;
};

ipc.on('file_results',function(event, data){
	console.log('data',data);
	self.files(data);
	self.loading(false);
});

self.open = function(){
	ipc.send('open');
}

window.onload = function(){
	init();
	ko.applyBindings(self,document.getElementById('main'));
}
