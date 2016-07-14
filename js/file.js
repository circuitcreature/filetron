'use strict';

var ipc = require('electron').ipcRenderer;
var React = require('react');
var Dom = require('react-dom');

var model_react = function(){
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
		React.createElement("", {}),
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
		strict: true
	}
	self.type = function(obj){
		return Object.prototype.toString.call(obj).slice(8, -1);
	}
	self.defined = {};
	self.validate = function(){

	};
	self.hydrate = function(_d){
		for(let pi in _d){
			if(!self.defined.hasOwnProperty(pi)){
				continue
			}
			self[pi] = _d[pi];
		}
	}
	self.out = function(){
		var out = {}
		for(let pi in self.defined){
			out[pi] = self[pi];
		}
		return out
	}
	self.extend = function(data){
		self.build(data)
		return self
	}
	self.build = (function(_d){
		return function(){
			for(let pi in _d){
				self.defined[pi] = self.type(_d[pi]);
				self[pi] = _d[pi];
			}
		}
	})(data)

	return self.extend(self.defined)
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
