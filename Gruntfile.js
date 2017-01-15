module.exports = (grunt) => {
    'use strict';

    const pkg = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        src_dir: 'src/main/webapp',
        src_main: 'src/main/webapp/main.js',
        dist_dir: 'target/' + pkg.name,
        dist_main: 'target/' + pkg.name + '/bundle.js',
        test_dir: 'src/test/webapp/',
        test_reports_dir: 'target/test-reports/',
        css_src_files: ['css/**/*.scss', 'css/**/*.css'],
        static_files: ['*.html', '*.ico', 'images/*', 'fonts/*'],

        // Delete output files
        clean: {
            'app-bundle': ['<%= dist_main %>'],
            'static-files': {
                expand: true,
                cwd: '<%= dist_dir %>',
                src: ['*.html', '*.js', 'css/', 'images/', 'fonts/'],
            },
            'test-reports': ['<%= test_reports_dir %>']
        },

        // Syntax (and style) check
        eslint: {
            sources: ['<%= src_dir %>/*.js'],
            tests: ['<%= test_dir %>/*.js']
        },

        // Static type checks
        flowbin: {
            check: {},
        },

        // Compile for the browser
        browserify: {
            options: {
                transform: [
                    // presets are in .babelrc
                    ['babelify']
                ]
            },
            compile: {
                src: ['<%= src_main %>'],
                dest: '<%= dist_main %>'
            },
            'compile-and-watch': {
                src: ['<%= src_main %>'],
                dest: '<%= dist_main %>',
                options: {
                    watch: true,
                    browserifyOptions: {
                        // Generate source maps
                        debug: true
                    }
                }
            }
        },

        // Compile scss files
        sass: {
            // TODO : only when debugging
            options: {
                sourceMap: true,
                sourceMapContents: true
            },
            compile: {
                cwd: '<%= src_dir %>',
                src: ['<%= css_src_files %>'],
                dest: '<%= dist_dir %>',
                expand: true,
                ext: '.css'
            }
        },

        // Copy static files to the dist directory
        copy: {
            'static-files': {
                expand: true,
                cwd: '<%= src_dir %>',
                src: ['<%= static_files %>'],
                dest: '<%= dist_dir %>'
            },
            // TODO : copy the css maps, but only when debugging
            bootstrap: {
                expand: true,
                cwd: 'node_modules/bootstrap/dist/',
                src: ['css/*.min.css', 'fonts/*'],
                dest: '<%= dist_dir %>'
            },
            c3: {
                expand: true,
                cwd: 'node_modules/c3/',
                src: ['c3.min.js'],
                dest: '<%= dist_dir %>'
            },
            'c3-css': {
                expand: true,
                cwd: 'node_modules/c3/',
                src: ['c3.min.css'],
                dest: '<%= dist_dir %>/css/'
            },
            d3: {
                expand: true,
                cwd: 'node_modules/d3/',
                src: ['d3.min.js'],
                dest: '<%= dist_dir %>'
            }
        },

        // Run tests
        mocha_istanbul: {
            tests: {
                src: '<%= test_dir %>',
                options: {
                    mochaOptions: ['--compilers', 'js:babel-register'],
                    recursive: true,
                    coverageFolder: '<%= test_reports_dir %>',
                    reportFormats: ['lcovonly', 'html']
                }
            }
        },

        coveralls: {
            options: {
                force: true
            },
            lcov: {
                src: '<%= test_reports_dir %>/*.info',
            },
        },

        // This keeps grunt running and copy the compiled bundle and static resources as they change
        // (but it's browserify:compile-and-watch that re-regenerates the bundle)
        watch: {
            bundle: {
                files: ['<%= dist_main %>'],
                tasks: ['validate']
            },
            sass: {
                files: ['<%= css_src_files %>'],
                tasks: ['sass'],
                options: {
                    cwd: '<%= src_dir %>'
                }
            },
            'static-files': {
                files: ['<%= static_files %>'],
                tasks: ['copy'],
                options: {
                    cwd: '<%= src_dir %>'
                }
            }
        },

        // Compress the bundle
        uglify: {
            options: {
                mangle: true,
                compress: {
                    // drop_console: true,
                    // drop_debugger: true
                }
            },
            bundle: {
                files: {
                    '<%= dist_main %>': ['<%= dist_main %>']
                }
            }
        },

        'http-server': {
            run: {
                root: '<%= dist_dir %>',
                runInBackground: true,
                openBrowser: true
            }
        }
    });

    grunt.event.on('coverage', (lcov, done) => {
        // Let Grunt know the test coverage is done
        done();
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-flowbin');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-sass');

    // Lifecycle
    grunt.registerTask('validate', ['eslint', 'flowbin']);
    grunt.registerTask('compile', ['browserify:compile']);
    grunt.registerTask('test', ['mocha_istanbul']);
    grunt.registerTask('prepare', ['sass', 'copy']);

    // Aliases
    grunt.registerTask('build', ['clean', 'validate', 'compile', 'test', 'prepare', 'uglify']);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('debug', ['clean', 'validate', 'browserify:compile-and-watch', 'prepare', 'http-server', 'watch']);
    grunt.registerTask('ci', ['build', 'coveralls']);
};
