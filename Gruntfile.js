module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // coffee: {
    //   compile: {
    //     files: {
    //       './public/javascripts/main.js': [
    //       ]
    //     }
    //   }
    // },
    uglify: {
      my_target: {
        files: {
          './public/javascripts/main.min.js': ['./public/javascripts/main.js']
        }
      }
    },
    less: {
      development: {
        files: {
          './public/stylesheets/style.css': ['./public/less/bootstrap/bootstrap.less', './public/less/*.less']
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: './public/stylesheets',
          src: ['style.css', 'main.css'],
          dest: './public/stylesheets',
          ext: '.min.css'
        }]
      }
    }
  });

  // compile CoffeeScript
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify')
  // uglify js
  grunt.registerTask('js', ['uglify']);

  // compile less into css
  grunt.loadNpmTasks('grunt-contrib-less');
  // minify css
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('dist', ['less', 'cssmin'])
};
