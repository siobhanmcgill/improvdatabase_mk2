module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-bump');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mocha: {
            test: {
                src: []
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['package.json', 'bower.json'],
                commit: false
            }
        }
    });
};
