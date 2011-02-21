var Parser = require('../lib/parser')
var fs = require('fs');
var sys = require('sys');

var file = fs.readFileSync(process.cwd() + '/sample/fs.nd', 'utf8');
var doc = new Parser(file);
process.stdout.write(JSON.stringify(doc.parse()));
