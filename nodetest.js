#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var first = process.argv[0];
var second = process.argv[1];

var rootdir = process.argv[2];


console.log("first is " + first);
console.log("second is " + second);
console.log("rootdir is " + rootdir);

var data = fs.readFileSync(rootdir, 'utf8');
console.log(data);