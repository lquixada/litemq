var path = require('path');
var snippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

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
    },

		connect: {
			pivotal: {
				options: {
					port: 9001,
					base: '.'
				}
			},

			livereload: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [snippet, connect.static(path.resolve(options.base))];
          }
        }
      }
		},

		livereload: {
      port: 35729
    },

	  jasmine: {
			pivotal: {
				src: '*.src.js',
				options: {
					host: 'http://localhost:9001/',
					vendor: 'lib/o.min.js',
					specs: '*.spec.js',
					outfile: 'runner.html'
				}
			}
		},
		
		regarde: {
			pivotal: {
				files: ['**/*.src.js', '**/*.spec.js'],
				tasks: ['jasmine:pivotal'],
				spawn: true
			},

      livereload: {
        files: ['**/*.src.js', '**/*.spec.js'],
        tasks: ['livereload']
      }
    }
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-regarde');

	// Aliased tasks (for readability purposes on "build" task)
  grunt.registerTask('o:jsmin', 'uglify:build');
  grunt.registerTask('o:jslint', 'jshint');
	grunt.registerTask('o:ci', ['connect:pivotal', 'jasmine']);
	grunt.registerTask('o:regarde:pivotal', ['connect:pivotal', 'regarde:pivotal']);
	grunt.registerTask('o:regarde:livereload', ['livereload-start', 'connect:livereload', 'jasmine:pivotal:build', 'regarde:livereload']);

	// Batch taks
	grunt.registerTask('o:build', ['o:ci', 'o:jslint', 'o:jsmin']);
};
