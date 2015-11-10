module.exports = function (grunt) {
    grunt.initConfig({
        // define source files and their destinations
        uglify: {
            files: {
                src: [ 'web/phaser.js', 'web/js/**/*.js', '!web/*.min.js'],  // source files mask
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

    // register at least this one task
    grunt.registerTask('default', [ 'uglify' ]);
};