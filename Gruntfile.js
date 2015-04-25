module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mocha: {
            test: {
                src: []
            }
        }
    });
};
