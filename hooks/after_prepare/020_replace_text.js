#!/usr/bin/env node

// this plugin replaces arbitrary text in arbitrary files
//
// Look for the string CONFIGURE HERE for areas that need configuration
//

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

console.log("Running: " + process.argv[1]);

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(to_replace, "g"), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

var target = "stage";
if (process.env.TARGET) {
    target = process.env.TARGET;
}

var platform = process.env.CORDOVA_PLATFORMS;

if (rootdir) {
    var configFilename = path.join(rootdir, "hooks", "project.json");
    var configObject = JSON.parse(fs.readFileSync(configFilename, 'utf8'));

    Object.keys(configObject).forEach(function (configKey) {
        console.log("CONFIG KEY: " + configKey);
        var configs = configObject[configKey];
        configs.forEach(function (config) {
            if (config.platform === platform) {
                console.log("Found replacement for platform " + platform);
                config.files.forEach(function (file) {
                    var filename = path.join(rootdir, file);
                    if (fs.existsSync(filename)) {
                        console.log(filename + " : " + configKey + " -> " + config.value);
                        replace_string_in_file(filename, configKey, config.value);
                    } else {
                        console.error("File not found: " + filename + " for config key " + configKey);
                    }
                });
            }
        });
    });

}
