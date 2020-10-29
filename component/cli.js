module.exports = function(waw){
	waw.exe('ng g c '+waw.path, function(){
		if (waw.fs.existsSync(waw.base+'.component.spec.ts')) {
			waw.fs.unlinkSync(waw.base+'.component.spec.ts');
		}
		let html = waw.fs.readFileSync(waw.params.template+'/component.html', 'utf8');
		html = html.split('CNAME').join(waw.Name);
		html = html.split('NAME').join(waw.name);
		waw.fs.writeFileSync(waw.base+'.component.html', html, 'utf8');
		let scss = waw.fs.readFileSync(waw.params.template+'/component.scss', 'utf8');
		scss = scss.split('CNAME').join(waw.Name);
		scss = scss.split('NAME').join(waw.name);
		waw.fs.writeFileSync(waw.base+'.component.scss', scss, 'utf8');
		let ts = waw.fs.readFileSync(waw.params.template+'/component.ts', 'utf8');
		ts = ts.split('CNAME').join(waw.Name);
		ts = ts.split('NAME').join(waw.name);
		waw.fs.writeFileSync(waw.base+'.component.ts', ts, 'utf8');
		console.log('Component has been created');
		process.exit(1);
	});
}