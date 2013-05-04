module.exports = function (grunt) {

	grunt.initConfig({
		projectName: 'litemq',

	  jasmine: {
			pivotal: {
				src: '*.src.js',
				options: {
					host: 'http://localhost:9001/',
					vendor: './vendor/pro.create-0.0.3.min.js',
					specs: '*.spec.js',
					outfile: 'runner.html'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-o-bundle');
};
