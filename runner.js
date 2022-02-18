const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});
const path = require('path');
const fs = require('fs');
const defaults = {
	alert: {
		default: __dirname + '/alert/default'
	},
	component: {
		default: __dirname + '/component/default'
	},
	loader: {
		default: __dirname + '/loader/default'
	},
	modal: {
		default: __dirname + '/modal/default'
	},
	page: {
		default: __dirname + '/page/default'
	},
	pipe: {
		default: __dirname + '/pipe/default'
	},
	popup: {
		default: __dirname + '/popup/default'
	},
	service: {
		default: __dirname + '/service/default'
	},
	module: {
		default: __dirname + '/module/default'
	}
}
const ensure = (waw, folder, exists, is_component = true) => {
	if (waw.argv.length < 2) {
		console.log('Provide name');
		process.exit(0);
	}
	if (waw.argv[waw.argv.length - 1].endsWith('.git')) {
		waw.repo = waw.argv.pop();
	}
	waw.name = waw.argv[waw.argv.length-1].toLowerCase();
	waw.Name = waw.name.slice(0, 1).toUpperCase() + waw.name.slice(1);
	if (waw.argv.length>2) {
		waw.argv[1] = folder + '/' + waw.argv[1];
	}
	while (waw.argv.length>2) {
		waw.argv[1] += '/' + waw.argv.pop();
	}
	if (!fs.existsSync(process.cwd() + '/src/app/' + folder)) {
		fs.mkdirSync(process.cwd() + '/src/app/' + folder);
	}
	if (waw.name.indexOf('/')>=0) {
		waw.path = waw.name;
		waw.name = waw.name.split('/').pop();
	} else {
		waw.path = folder + '/' + waw.name;
	}
	waw.base = process.cwd() + '/src/app/' + waw.path;
	if (fs.existsSync(waw.base)) {
		console.log(exists);
		process.exit(0);
	}
	if (is_component) {
		waw.base += '/' + waw.name;
	}
	if (waw.repo) {
		fs.mkdirSync(waw.base);
		waw.fetch(waw.base, waw.repo, (err)=>{
			if (err) console.log('Repository was not found');
			else console.log('Code is successfully installed');
			process.exit(1);
		});
	}
	return waw.repo;
}
const read_customization = (waw, element, next) => {
	let elements = waw.getDirectories(process.cwd() + '/template/' + element);
	for (var i = 0; i < elements.length; i++) {
		defaults[element][path.basename(elements[i])] = elements[i];
	}
	if (Object.keys(defaults[element]).length > 1) {
		waw.template = defaults[element];
		let text = 'Which element you want to use?', counter = 0, repos = {};
		for (let key in defaults[element]) {
			repos[++counter] = defaults[element][key];
			text += '\n' + counter + ') ' + key;
		}
		text += '\nChoose number: ';
		return readline.question(text, (answer) => {
			if (!answer || !repos[parseInt(answer)]) {
				return this.read_customization(waw, element, next);
			}
			waw.template = repos[parseInt(answer)];
			next();
		});
	} else {
		waw.template = defaults[element].default;
		next();
	}
}
/*
	Alert
*/
const new_alert = (waw) => {
	if (!waw.path) {
		if(ensure(waw, 'alerts', 'Alert already exists')) return;
	}
	if (!waw.template) {
		return read_customization(waw, 'alert', () => { new_alert(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.alert = new_alert;
module.exports.a = new_alert;
/*
	Component
*/
const new_component = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'core/components', 'Component already exists')) return;
	}
	if (!waw.template) {
		return read_customization(waw, 'component', () => { new_component(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.component = new_component;
module.exports.c = new_component;
/*
	Loader
*/
const new_loader = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'loaders', 'Loader already exists')) return;
	}
	if (!waw.template) {
		return read_customization(waw, 'loader', () => { new_loader(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.loader = new_loader;
module.exports.l = new_loader;
/*
	Popup
*/
const new_popup = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'popups', 'Popup already exists')) return;
	}
	if (!waw.template) {
		return read_customization(waw, 'popup', () => { new_popup(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.popup = new_popup;
/*
	Modal
*/
const new_modal = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'modals', 'Modal already exists')) return;
	}
	if (!waw.template) {
		return read_customization(waw, 'modal', () => { new_modal(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.modal = new_modal;
module.exports.m = new_modal;
/*
	Page
*/
const new_page = function (waw) {
	// waw page user profile REPO
	if (!waw.path) {
		if(ensure(waw, 'pages', 'Page already exists')) return;
	}
	if (!waw.template) {
		return read_customization(waw, 'page', () => { new_page(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.page = new_page;
module.exports.p = new_page;
/*
	Pipe
*/
const new_pipe = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'core/pipes', 'Pipe already exists', false)) return;
	}
	if (!waw.template) {
		return read_customization(waw, 'pipe', () => { new_pipe(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.pipe = new_pipe;
/*
	Service
*/
const new_service = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'services', 'Service already exists', false)) return;
	}
	if (!fs.existsSync(process.cwd() + '/src/app/services/index.ts')) {
		fs.writeFileSync(process.cwd() + '/src/app/services/index.ts', '');
	}
	if (!waw.template) {
		return read_customization(waw, 'service', () => { new_service(waw) });
	}
	require(waw.template + '/cli.js')(waw);
}
module.exports.service = new_service;
module.exports.s = new_service;
/*
	Customization
*/
const generate = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'services', 'Service already exists')) return;
	}
	if (!waw.element) {
		if (waw.argv.length && defaults[waw.argv[0].toLowerCase()]) {
			waw.element = waw.argv[0].toLowerCase();
		} else {
			let text = 'Which element you want to customize?', counter = 0, repos = {};
			for (let key in defaults) {
				repos[++counter] = key;
				text += '\n' + counter + ') ' + key;
			}
			text += '\nChoose number: ';
			return readline.question(text, function (answer) {
				if (!answer || !repos[parseInt(answer)]) return new_project();
				waw.element = repos[parseInt(answer)];
				generate(waw);
			});
		}
	}
	if (!defaults[waw.element]) {
		delete waw.element;
		return generate(waw);
	}
	if (!waw.name) {
		if (waw.argv.length > 1) {
			waw.name = waw.argv[1].toLowerCase();
		} else {
			return readline.question('Provide name for customization: ', function (answer) {
				waw.name = answer.toLowerCase();
				generate(waw);
			});
		}
	}
	let path = process.cwd() + '/template/' + waw.element + '/' + waw.name;
	fs.mkdirSync(process.cwd() + '/template/' + waw.element, { recursive: true });
	if (fs.existsSync(path)) {
		console.log('Customization already exists');
		process.exit(0);
	}
	waw.exe('cp -rf ' + __dirname + '/' + waw.element + ' ' + path, () => {
		console.log('Customization ' + waw.element + ' ' + waw.name + ' created');
		process.exit(1);
	});
}
module.exports.generate = generate;
module.exports.g = generate;
/*
	Module
*/
const new_module = function (waw) {
	if (!waw.path) {
		if(ensure(waw, 'modules', 'Module already exists', false)) return;
	}
	if (!fs.existsSync(process.cwd() + '/src/app/modules/index.ts')) {
		fs.writeFileSync(process.cwd() + '/src/app/modules/index.ts', '');
	}
	if (!params.template) {
		return read_customization(params, 'module', () => { new_module(params) });
	}
	require(params.template + '/cli.js')(waw);
}
module.exports.install = new_module;
module.exports.i = new_module;
const _fetch_module = (waw, location, callback) => {
	if (!fs.existsSync(location + '/module.json')) {
		return callback(false);
	}
	let json = waw.readJson(location + '/module.json');
	if(!json.repo) {
		return callback(false);
	}
	waw.fetch(path.normalize(location), json.repo, err=>{
		if (err) {
			// console.log(err);
			// console.log(json);
			// console.log(json.repo);
			// console.log(location + '/module.json');
		}
		callback(!err);
	});
}
const fetch_module = function (waw) {
	if (waw.argv.length>1) {
		_fetch_module(waw, process.cwd() + '/src/app/modules/' + waw.argv[1].toLowerCase(), done=>{
			if (done) console.log(waw.argv[1] + ' were fetched from the repo');
			else console.log(waw.argv[1] + " don't have repo");
		});
	} else {
		let folders = waw.getDirectories(process.cwd() + '/src/app/modules');
		let counter = folders.length;
		for (let i = 0; i < folders.length; i++) {
			_fetch_module(waw, folders[i], ()=>{
				if(--counter===0) {
					console.log('All possible modules were fetched from their repositories');
					process.exit(1);
				}
			});
		}
	}
}
module.exports.fetch = fetch_module;
module.exports.f = fetch_module;
/*
	Upload
*/
const add_token = waw => {
	if (fs.existsSync(waw.waw_root + '/config.json')) {
		let waw_conf = JSON.parse(fs.readFileSync(waw.waw_root + '/config.json'));
		if (waw_conf.token) {
			waw.ngx_config.token = waw_conf.token;
			fs.writeFileSync(process.cwd() + '/angular.json', JSON.stringify(waw.ngx_config, null, 2));
			return upload_files(waw);
		}
	}
	const req = https.request({
		hostname: 'webart.work',
		port: 443,
		path: '/api/user/token',
		method: 'GET'
	}, resp => {
		resp.on('data', data => {
			const json = JSON.parse(data.toString());
			waw.ngx_config.token = json.token;
			fs.writeFileSync(process.cwd() + '/angular.json', JSON.stringify(waw.ngx_config, null, 2));
			if (fs.existsSync(waw.waw_root + '/config.json')) {
				let waw_conf = JSON.parse(fs.readFileSync(waw.waw_root + '/config.json'));
				waw_conf.token = json.token;
				fs.writeFileSync(waw.waw_root + '/config.json', JSON.stringify(waw_conf, null, 2));
			}
		})
	});
	req.on('error', error => {
		console.error(error)
	});
	req.end();
}
const upload_file = (waw, file, done) => {
	/*
	waw.ngx_config.name
	waw.ngx_config.token
	file
	*/
}
const upload_files = waw => {
	const req = https.request({
		hostname: 'webart.work',
		port: 443,
		path: '/api/user/prepare',
		method: 'GET'
	}, resp => {
		resp.on('data', data => {
			const json = JSON.parse(data.toString());
			if (!json.ready) {
				console.log('Something went wrong');
				process.exit(1);
			}
			const files = waw.getFilesRecursively(process.cwd() + '/dist/app');
			let counter = files.length;
			for (var i = files.length - 1; i >= 0; i--) {
				files[i]
				this.upload_file(waw, files[i], () => {
					if (--counter === 0) {
						console.log('Uploaded properly');
						process.exit(1);
					}
				});
			}
		});
	});
	req.on('error', error => {
		console.error(error)
	});
	req.end();
}
const upload = waw => {
	if (!fs.existsSync(process.cwd() + '/angular.json')) {
		console.log('This is not angular project');
		process.exit(1);
	}
	waw.ngx_config = JSON.parse(fs.readFileSync(process.cwd() + '/angular.json'));
	if (!waw.ngx_config.name) {
		waw.ngx_config.name = path.basename(process.cwd());
		fs.writeFileSync(process.cwd() + '/angular.json', JSON.stringify(waw.ngx_config, null, 2));
	}
	if (!waw.ngx_config.token) add_token(waw);
	else upload_files(waw);
}
module.exports.upload = upload;
module.exports.u = upload;
/*
	End Of
*/
