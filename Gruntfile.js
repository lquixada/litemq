var fs = require('fs');

module.exports = function ( grunt ) {
	var projectName = 'litemq'; 

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
      files: ['*.src.js', '*.spec.js']
    },

    uglify: {
      build: {
        src: ['*.src.js'],
        dest: projectName+'.min.js'
      }
    }
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Aliased tasks (for readability purposes on "build" task)
  grunt.registerTask('o:jsmin', 'uglify:build');
  grunt.registerTask('o:jslint', 'jshint');
	grunt.registerTask('o:test', 'test');

	// Batch taks
	grunt.registerTask('o:build', ['o:test', 'o:jslint', 'o:jsmin']);

	
	grunt.registerTask('test', 'Run specs using npm test', function () {
		var done = this.async();

		grunt.util.spawn( { cmd: 'npm', args: ['test'] }, function ( err, result, code ) {
			var output = result.stderr? result.stderr: result.stdout;
			grunt.log.writeln( '\n'+output+'\n' );
			
			done( code>0? false: true );
		} );
	} );
};
