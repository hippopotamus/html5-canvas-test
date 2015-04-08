module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compile: {
        files: {
          './public/javascripts/main.js': [
          ]
        }
      }
    },
    less: {
      development: {
        files: {
          './public/stylesheets/style.css': ['./public/less/*.less']
        }
      }
    }
  });

  // compile CoffeeScript
  grunt.loadNpmTasks('grunt-contrib-coffee');
  // uglify js
  grunt.registerTask('js', ['coffee']);

  // compile less into css
  grunt.loadNpmTasks('grunt-contrib-less');
  // minify css
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('dist', ['less'])



};
