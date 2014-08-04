#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var fileGlobsToCopy = {
    "config/android/res/drawable/*.png": "platforms/android/res/drawable/",
    "config/android/res/drawable-hdpi/*.png": "platforms/android/res/drawable-hdpi/",
    "config/android/res/drawable-ldpi/*.png": "platforms/android/res/drawable-ldpi/",
    "config/android/res/drawable-mdpi/*.png": "platforms/android/res/drawable-mdpi/",
    "config/android/res/drawable-xhdpi/*.png": "platforms/android/res/drawable-xhdpi/",
    "config/android/res/drawable-xxhdpi/*.png": "platforms/android/res/drawable-xxhdpi/",
    "config/android/res/drawable-xxxhdpi/*.png": "platforms/android/res/drawable-xxxhdpi/",
    "config/ios/Resources/icons/*.png": "platforms/ios/bubbla/Resources/icons/",
    "config/ios/Resources/splash/*.png": "platforms/ios/bubbla/Resources/splash/"
};

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');

// no need to configure below
var rootdir = process.argv[2];

console.log("Running: " + process.argv[1]);

Object.keys(fileGlobsToCopy).forEach(function (fileGlob) {
    var destDir = path.join(rootdir, fileGlobsToCopy[fileGlob]);
    var files = glob.sync(fileGlob, { "nonull": false});
    files.forEach(function (file) {
        var srcFile = path.join(rootdir, file);
        var filename = path.basename(srcFile);
        var destFile = path.join(destDir, filename);
        var fn = function () {
            console.log(srcFile + " -> " + destFile);
            fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
        };
        if (fs.existsSync(srcFile)) {
            if (!fs.existsSync(destDir)) {
                mkdirp(destDir, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        fn();
                    }
                });
            } else {
                fn();
            }
        }
    });
});

// filestocopy.forEach(function(obj) {
//     Object.keys(obj).forEach(function(key) {
//         var val = obj[key];
//         var srcfile = path.join(rootdir, key);
//         var destfile = path.join(rootdir, val);
//         //console.log("copying " + srcfile + " to " + destfile);
//         var destdir = path.dirname(destfile);
//         if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
//             fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
//         }
//     });
// });
