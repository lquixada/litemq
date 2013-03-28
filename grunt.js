var fs = require('fs');

module.exports = function ( grunt ) {
	var projectName = 'litemq'; 

  grunt.initConfig({
    lint: {
      files: ['*.src.js', '*.spec.js', 'js/*.src.js', 'specs/*.spec.js']
    },

    jshint: {
      options: '<json:.jshintrc>'
    },

    concat: {
      js: {
        src: ['*.src.js', 'js/*.src.js'],
        dest: 'build/'+projectName+'.src.js'
      },

      css: {
        src: ['*.src.css', 'css/*.src.css'],
        dest: 'build/'+projectName+'.src.css'
      }
    },

    min: {
      dist: {
        src: ['*.src.js', 'js/*.src.js'],
        dest: ''+projectName+'.min.js'
      },

      build: {
        src: ['*.src.js', 'js/*.src.js'],
        dest: 'build/'+projectName+'.min.js'
      }
    },

    cssmin: {
      dist: {
        src: ['*.src.css', 'css/*.src.css'],
        dest: ''+projectName+'.min.css'
      },

      build: {
        src: ['*.src.css', 'css/*.src.css'],
        dest: 'build/'+projectName+'.min.css'
      }
    },
    
    imgs: {
			build: {
				src: 'imgs',
				dest: 'build'
			}
    },

    watch: {
        files: ['*.js', 'js/*.js', '*.css', 'css/*.css'],
        tasks: 'reload'
    },

    reload: {
        port: 6001,
        proxy: {
            host: 'localhost',
            port: 8088 // should match server.port config
        }
    },

    server: {
      port: 8088,
      base: '.'
    }
  });

  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-reload');

  // Aliased tasks (for readability purposes on "build" task)
  grunt.registerTask('o:cssmin', 'cssmin:dist');
  grunt.registerTask('o:jsmin', 'min:dist');
  grunt.registerTask('o:jslint', 'lint');
  grunt.registerTask('o:imgs', 'imgs');
  grunt.registerTask('o:min', 'min:dist');
  grunt.registerTask('o:test', 'test');

  // Batch taks
  grunt.registerTask('o:build', 'o:test o:jslint o:jsmin o:cssmin o:imgs');
  grunt.registerTask('o:watch', 'server reload watch');

  
  grunt.registerMultiTask('imgs', 'Copy images to the build folder', function () {
      var done = this.async();

      if (fs.existsSync(this.data.src)) {
          grunt.utils.spawn({ cmd: 'cp', args: ['-R', this.data.src, this.data.dest]}, function (err, result, code) {
              if ( result.stderr ) {
                  grunt.log.writeln( '\n'+result.stderr+'\n' );
              } else {
                  grunt.log.writeln('Image files copied successfully.');
              }
              
              done(code>0? false: true);
          } );
      } else {
          grunt.log.writeln('Nothing to do.');
      }
  } );

  
  grunt.registerTask('test', 'Run specs using npm test', function () {
      var done = this.async();

      grunt.utils.spawn( { cmd: 'npm', args: ['test'] }, function ( err, result, code ) {
          var output = result.stderr? result.stderr: result.stdout;
          grunt.log.writeln( '\n'+output+'\n' );
          
          done( code>0? false: true );
      } );
  } );
};
