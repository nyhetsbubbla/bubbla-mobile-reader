#!/usr/bin/env node

// this plugin replaces arbitrary text in arbitrary files
//
// Look for the string CONFIGURE HERE for areas that need configuration
//

var fs = require('fs');
var path = require('path');
var parseString = require('xml2js').parseString;

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

var APP_VERSION = "?.?.?";
parseString(fs.readFileSync(path.join(rootdir, "config.xml"), 'utf8'), function (err, result) {
    if (result && result.widget && result.widget.$ && result.widget.$.version ) {
        APP_VERSION = result.widget.$.version;
    }
});

console.log("APP_VERSION=" + APP_VERSION);

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
                        var value = config.value;
                        if (value === "$$APP_VERSION$$") {
                            value = APP_VERSION;
                        }
                        console.log(filename + " : " + configKey + " -> " + value);
                        replace_string_in_file(filename, configKey, value);
                    } else {
                        console.error("File not found: " + filename + " for config key " + configKey);
                    }
                });
            }
        });
    });

}
