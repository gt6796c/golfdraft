module.exports = function (grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var webpack = require('webpack');

  grunt.initConfig({
    express: {
      dev: {
         options: {
          script: './server/server.js',
          debug: true,
          output: 'I am fully running now!'
        }
      }
    },

    clean: {
      prod: {
        src: 'dist'
      },
      dev: {
        src: 'distd'
      }
    },

    webpack: {
      options: require('./webpackConfig'),

      prod: {
        output: {
          path: './dist/',
          filename: 'bundle.js'
        },
        plugins: [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin(),
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.DefinePlugin({
            // Remove all debug-only code from React
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          })
        ]
      },

      dev: {
        output: {
          path: './distd/',
          filename: 'bundle.js'
        },
        devtool: 'eval', // Fast rebuild
        watch: true,
        keepalive: true,
        failOnError: false
      }
    },

    mochaTest: {
      test: {
        src: ['./test/*Test.js']
      }
    },

    copy: {
      prod: {
        src: './views/index.handlebars',
        dest: './dist/'
      },
      dev: {
        src: './views/index.handlebars',
        dest: './distd/'
      }
    },

    hashres: {
      options: {
        fileNameFormat: '${name}.${hash}.${ext}',
      },
      prod: {
        src: ['./dist/*.js', './dist/*.css'],
        dest: './dist/views/index.handlebars'
      }
    },

    // Experimental at this point
    mochaSelenium: {
      options: {
        reporter: 'spec',
        useChaining: true
      },
      firefox: {
        src: ['./test/selenium/test*.js']
      }
    }

  });

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('buildd', [
    'clean:dev',
    'copy:dev',
    'webpack:dev'
  ]);

  grunt.registerTask('build', [
    'clean:prod',
    'copy:prod',
    'webpack:prod',
    'hashres'
  ]);

  grunt.registerTask('rund', [
    'express:dev',
    'buildd'
  ]);

  grunt.registerTask('default', [
    'rund'
  ]);

};
