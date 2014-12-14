module.exports = function (grunt) {
// Load grunt tasks automatically
require('load-grunt-tasks')(grunt);
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
        appDir: 'app',
        banner: '/*!\n' +
          ' * <%= pkg.name %>\n' +
          ' * <%= pkg.title %>\n' +
          ' * @author <%= pkg.author %>\n' +
          ' * License: <%= pkg.license %> licensed.\n' +
          ' */\n'
    },

    watch: {
        livereload: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            tasks: ['sass:dev'],
            files: [
                '<%= config.appDir %>/{,**/}*.html',
                '<%= config.appDir %>/css/{,**/}*.css',
                '<%= config.appDir %>/js/{,**/}*.js',
                '<%= config.appDir %>/images/{,*/}*'
            ]
        },
        css: {
            tasks: ['sass:dev'],
            files: [
                '<%= config.appDir %>/scss/{,**/}*.scss'
            ]
        }
    },

    connect: {
        options: {
            port: 9000,
            livereload: 35729,
            hostname: 'localhost'
        },
        livereload: {
            options: {
                open: true,
                base: [
                    '<%= config.appDir %>'
                ]
            }
        },
    },

    sass: {
        dev: {
            options: {
                style: 'expanded',
                banner: '<%= config.banner %>',
                compass: true
            },
            files: {
                '<%= config.appDir %>/css/style.css': '<%= config.appDir %>/scss/style.scss'
            }
        },
        dist: {
            options: {
                style: 'compressed',
                compass: true
            },
            files: {
                '<%= config.appDir %>/css/style.css': '<%= config.appDir %>/scss/style.scss'
            }
        }
    }
});

grunt.registerTask('serve', function (target) {
    grunt.task.run([
        'connect:livereload',
        'sass:dev',
        'watch'
    ]);
});
};