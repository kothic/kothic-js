/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            options: {
                strict: false,

                bitwise: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                sub: true,
                undef: true,
                unused: true,

                globals: {
                    MapCSS: true,
                    L: true,
                    Kothic: true,
                    console: true,
                    rbush: true
                },

                // camelcase: true,
                trailing: true,
                indent: 4,
                // quotmark: 'single',
                // maxlen: 120,

                // force breaking complex functions into smaller ones for readability
                // maxstatements: 10,
                // maxcomplexity: 5,

                browser: true
            },
            all: {
                src: ['Gruntfile.js', 'src/**/*.js', 'dist/kothic-leaflet.js', '!src/utils/rbush.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};
