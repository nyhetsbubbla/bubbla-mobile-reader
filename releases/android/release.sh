cordova plugin rm org.apache.cordova.console
cordova build --release android
cd releases/android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore market-release-key.keystore ../../platforms/android/ant-build/bubbel-release-unsigned.apk releasekey -signedjar bubbel-release-signed.apk
zipalign -v 4 bubbel-release-signed.apk bubbla-1.0.2.apk