module.exports = function(context) {
	// Copy any build extras
	console.log('Copying build extras')
	var path = context.requireCordovaModule('path')
	var fs = context.requireCordovaModule('fs')
	fs.copyFileSync(path.join(__dirname, '..', 'build-extras.gradle'),
	path.join(__dirname, '..', 'platforms', 'android', 'build-extras.gradle'))

	// Required to manage these issues
	// https://github.com/zo0r/react-native-push-notification/issues/748
	// https://forum.matomo.org/t/dexarchivebuilderexception-when-building-android-application-with-piwik-sdk/27518
	var Q = context.requireCordovaModule('q')
    var defer = new Q.defer()
	fs.readFile(path.join(__dirname, '..', 'platforms', 'android', 'build.gradle'), (error, data) => {
		if (error) {
			console.log(error)
			defer.resolve()
			return
		}
		console.log('Updating build file')
		var buildFile = data.toString().replace(/jcenter\(\)/g, 'maven { url "https://maven.google.com" }\n\tjcenter()')
		buildFile = data.toString().replace(/VERSION_1_6/g, 'VERSION_1_8')
		fs.writeFileSync(path.join(__dirname, '..', 'platforms', 'android', 'build.gradle'), buildFile)
		defer.resolve()
	})
}
