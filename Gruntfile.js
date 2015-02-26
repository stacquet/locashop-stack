module.exports = function(grunt) {

  // Configuration de Grunt
  grunt.initConfig({
  	concat: {
      options: {
        separator: ';', // permet d'ajouter un point-virgule entre chaque fichier concaténé.
      },
      dist: {
        src: ['public/app/*.js','public/app/**/*.js'], // la source
        dest: 'public/dist/built.js' // la destination finale
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/app/*.js','public/app/**/*.js'], // la source
        dest: 'public/dist/built_min.js' // la destination finale
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-concat'); // Voilà l'ajout.
  grunt.loadNpmTasks('grunt-contrib-uglify'); // Voilà l'ajout.

  grunt.registerTask('dev', ['concat:dist'])
  grunt.registerTask('dist', ['uglify:dist'])


}