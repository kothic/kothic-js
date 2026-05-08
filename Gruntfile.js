/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'dist/kothic.js'
            }
        },

        uglify: {
            options: {
                banner: '/*\n (c) 2011-2019, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko, Stephan Brandt\n' +
                        ' Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.\n' +
                        ' Built on <%= grunt.template.today("dd-mm-yyyy") %> |' +
                        ' https://github.com/kothic/kothic-js\n*/\n'
            },
            dist: {
                files: {
                    'dist/kothic.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);
};
