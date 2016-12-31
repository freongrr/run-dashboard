module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        src_dir: 'src/main/webapp',
        src_main: 'src/main/webapp/index.js',
        dist_dir: 'target/java-react-webapp/',
        dist_main: 'target/java-react-webapp/bundle.js',
        test_dir: 'src/test/webapp/',
        test_reports_dir: 'target/istanbul-reports/',

        // Delete output files
        clean: {
            'app-bundle': ['<%= dist_main %>'],
            'static-files': ['<%= dist_dir %>/*.html', '<%= dist_dir %>/*.css'],
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

        // Copy static files to the dist directory
        copy: {
            'static-files': {
                expand: true,
                cwd: '<%= src_dir %>',
                src: ['*.html', '*.css', '*.gif', '*.jpg', '*.svg'],
                dest: '<%= dist_dir %>'
            },
            bootstrap: {
                expand: true,
                cwd: 'node_modules/bootstrap/dist/',
                // TODO : only copy the css maps when debugging
                src: ['css/*.min.css', 'css/*.min.css.map', 'fonts/*'],
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
                    reportFormats: ['html']
                }
            }
        },

        // This keeps grunt running and copy the compiled bundle and static resources as they change
        // (but it's browserify:compile-and-watch that re-regenerates the bundle)
        watch: {
            bundle: {
                files: ['<%= dist_main %>'],
                tasks: ['copy']
            },
            'static-files': {
                files: ['<%= src_dir %>/*.html', '<%= src_dir %>/*.css'],
                tasks: ['copy']
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

    grunt.event.on('coverage', function (lcov, done) {
        // Let Grunt know the test coverage is done
        done();
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-flowbin');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('validate', ['eslint', 'flowbin']);
    grunt.registerTask('compile', ['browserify:compile', 'copy']);
    grunt.registerTask('build', ['clean', 'validate', 'compile', 'uglify']);
    grunt.registerTask('test', ['mocha_istanbul']);

    // Aliases
    grunt.registerTask('default', ['build', 'test']);
    grunt.registerTask('debug', ['clean', 'validate', 'browserify:compile-and-watch', 'copy', 'http-server', 'watch']);
};
