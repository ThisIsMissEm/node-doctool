var Parser = require('../lib/parser')
var fs = require('fs');
var sys = require('sys');

var file = fs.readFileSync(process.cwd() + '/sample/fs.nd', 'utf8');
var doc = new Parser(file);
doc.parse();

//console.log(doc.warnings);

console.log(doc.statistics());