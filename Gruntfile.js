module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/simpledom.min.js': ['src/*.js']
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js','src/*.js']
    },
    watch: {
      scripts: {
        files: 'src/*',
        tasks: ['jshint'],
        options: {
          interrupt: true
        },
      },
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  // Default task(s).
  grunt.registerTask('default', ['jshint','uglify','karma']);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

};