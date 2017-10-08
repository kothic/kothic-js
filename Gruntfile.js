/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            options: {
                strict: false,

                bitwise: false,
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                sub: true,
                undef: false,
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
        },

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

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
