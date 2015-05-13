module.exports = function(grunt) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-contrib-connect');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require('./build.config.js');

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          "package.json",
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json",
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */

    clean: {
      build: ['<%= build_dir %>'],
      compile: ['<%= compile_dir %>'],
      aux: ['<%= build_dir %>/assets/sass.css']
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_app_assets: {
        files: [{
          src: ['**'],
          dest: '<%= build_dir %>/assets/',
          cwd: 'src/assets',
          expand: true
        }]
      },
      build_vendor_assets: {
        files: [{
          src: ['<%= vendor_files.assets %>'],
          dest: '<%= build_dir %>/assets/',
          cwd: '.',
          expand: true,
          flatten: true
        }]
      },
      build_vendor_fonts: {
        files: [{
          src: ['<%= vendor_files.fonts %>'],
          dest: '<%= build_dir %>/assets/fonts/',
          flatten: true,
          cwd: '.',
          expand: true
        }]
      },
      build_appjs: {
        files: [{
          src: ['<%= app_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      build_vendorjs: {
        files: [{
          src: ['<%= vendor_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      build_htaccess: {
        files: [{
          src: ['.htaccess'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      compile_htaccess: {
        files: [{
          src: ['.htaccess'],
          dest: '<%= compile_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      compile_php: {
        files: [{
          src: ['*.php'],
          dest: '<%= compile_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      compile_config: {
        files: [{
          src: ['build/src/app/config.js'],
          dest: '<%= compile_dir %>/assets',
          cwd: '.',
          rename: function(dest, src) {
            return '<%= compile_dir %>/assets/<%= config_file %>.js';
          },
          expand: true
        }]
      },
      compile_assets: {
        files: [{
          src: ['**'],
          dest: '<%= compile_dir %>/assets',
          cwd: '<%= build_dir %>/assets',
          expand: true
        }]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/sass.css'

        ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          /*banner: '<%= meta.banner %>'*/
        },
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          '<%= build_dir %>/src/**/*.js',
          '<%= exclude_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    
    /**
     * `ngAnnotate` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     *
     * Replaced ngmin
     * See https://github.com/btford/ngmin/issues/93
     */
    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ '<%= app_files.js %>' ],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          /*banner: '<%= meta.banner %>'*/
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
     * Only our `main.less` file is included in compilation; all other files
     * must be imported from this file.
     */
    less: {
      build: {
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
        }
      },
      compile: {
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },

    /**
     * `grunt-contrib-sass` handles our SASS compilation and uglification automatically.
     * Only our `main.sass` file is included in compilation; all other files
     * must be imported from this file.
     */
    sass: {
      build: {
        files: {
          '<%= build_dir %>/assets/sass.css': '<%= app_files.scss %>'
        }
      },
      compile: {
        files: {
          '<%= build_dir %>/assets/sass.css': '<%= app_files.scss %>'
        },
        options: {
          style: "compressed"
        }
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        asi: true,
        loopfunc: true,
        curly: true,
        "-W065": true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true,
        globals: {
          "angular": true,
          "strict": false,
          "$": true,
          "browser": true,
          "document": true,
          "Kinetic": true,
          "fb": true



        }
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= app_files.atpl %>'],
        dest: '<%= build_dir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= app_files.ctpl %>'],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.*.js',
          '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.*.css'
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs', 'ngAnnotate']
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_vendor_fonts']
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: ['<%= app_files.html %>'],
        tasks: ['index:build']
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.atpl %>',
          '<%= app_files.ctpl %>'
        ],
        tasks: ['html2js']
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: ['src/**/*.less'],
        tasks: ['less:build', 'concat:build_css']
      },

      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass:build', 'concat:build_css']
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: ['jshint:test', 'karma:unit:run'],
        options: {
          livereload: false
        }
      }
    },

    /** 
     * Grunt server settings
     */
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      build: {
        options: {
          base: [
            '<%= build_dir %>'
          ]
        }
      },
      compile: {
        options: {
          port: 9001,
          base: '<%= compile_dir %>'
        }
      }
    },

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      files: {
        src: [
          '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js',
          '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    ngconstant: {
      // Options for all targets
      options: {
        wrap: true,
        name: 'app.config'
      },
      // Environment targets
      development: {
        options: {
          dest: 'src/app/app-config.js'
        },
        constants: {
          ENV: {
            name: 'development',
            apiEndpoint: '<%= api_development_url %>'
          }
        }
      },
      staging: {
        options: {
          dest: 'src/app/app-config.js'
        },
        constants: {
          ENV: {
            name: 'staging',
            apiEndpoint: '<%= api_staging_url %>'
          }
        }
      },
      production: {
        options: {
          dest: 'src/app/app-config.js'
        },
        constants: {
          ENV: {
            name: 'production',
            apiEndpoint: '<%= api_production_url %>'
          }
        }
      }
    }
  };

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['build', 'karma:unit', 'delta']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask('default', ['build', 'compile']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask('build', [
    'clean:build', 'html2js', 'jshint', 'sass:build',
    'concat:build_css', 'clean:aux', 'copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_vendor_fonts',
    'copy:build_appjs', 'copy:build_vendorjs', 'index:build', 'karmaconfig',
    'karma:continuous', 'ngAnnotate'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask('compile', [
    'clean:compile', 'sass:compile', 'concat:build_css', 'clean:aux', 'copy:compile_assets', 'ngAnnotate', 'concat:compile_js', 'uglify', 
    'filerev:files', 'index:compile'
  ]);

  /**
   * The `development` pulls the development API and builds/compiles app for deployment
   */
  grunt.registerTask( 'development', [
    'ngconstant:development', 'build', 'compile'
  ]);

  /**
   * The `staging` pulls the staging API and builds/compiles app for deployment
   */
  grunt.registerTask( 'staging', [
    'ngconstant:staging', 'build', 'compile'
  ]);

  /**
   * The `production` pulls the production API and builds/compiles app for deployment
   */
  grunt.registerTask( 'production', [
    'ngconstant:production', 'build', 'compile'
  ]);

  /**
   * For local dev, runs watch task and creates a live web server
   * build (local dev): grunt serve
   * bin (optimized): grunt serve:compile
   */
  grunt.registerTask( 'serve', function (target) {
    // Run locally with compiled code and staging API
    if (target === 'compile') {
      return grunt.task.run(['ngconstant:staging', 'default', 'connect:compile:keepalive']);
    }
    // Run locally with build code and development API
    else if (target === 'development') {
      return grunt.task.run(['ngconstant:development', 'connect:build', 'watch']);
    }
    // Run locally with compiled code and production API
    else if (target === 'production') {
      return grunt.task.run(['ngconstant:production', 'default', 'connect:compile:keepalive']);
    }

    // Run locally with build code and staging development API
    grunt.task.run(['ngconstant:staging', 'connect:build', 'watch']);
  });

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
    var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
      return file.replace( dirRE, '' );
    });
    grunt.file.copy('src/index.html', this.data.dir + '/index.html', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config( 'pkg.version' )
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function() {
    var jsFiles = filterForJS(this.filesSrc);

    grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
      process: function(contents, path) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};