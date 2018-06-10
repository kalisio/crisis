module.exports = function(context) {
	console.log('Copying build extras')
	var path = context.requireCordovaModule('path')
	var fs = context.requireCordovaModule('fs')
	fs.copyFileSync(path.join(__dirname, '..', 'build-extras.gradle'),
	path.join(__dirname, '..', 'platforms', 'android', 'build-extras.gradle'))
}
