module.exports = function (grunt) {
    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: 'out/Bubz.zip'
                },
                files: [
                    { expand: true, cwd: 'web/', src: ['**'], dest: '.'}
                ]
            }
        },
        uglify: {
            files: {
                src: ['web/phaser.js', 'web/js/**/*.js', '!web/*.min.js'],  // source files mask
                dest: 'web/app.js'
            }
        },
        watch: {
            js:  { files: 'js/*.js', tasks: [ 'uglify' ] }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // register at least this one task
    grunt.registerTask('default', [ 'uglify', 'compress' ]);
};