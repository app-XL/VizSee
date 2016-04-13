module.exports = function(grunt){


//initconfig Method defining Tasks 
grunt.initConfig(  {

pkg: grunt.file.readJSON('package.json'),

    uglify:{
       build: {
         options: {
              removeComments: true,
              collapseWhitespace: true
               },
       expand: true,
       cwd: 'public/',
       src: ['**/*.js','**/**/*.js','**/**/**/*.js','!libs/**/*.js','!libs/*.js','!libs/**/**/*.js'],
       dest: 'dist/public/'
      }
    },
 //html files minification
  minifyHtml: {
    build: {
    options: {
      removeComments: true,
      collapseWhitespace: true
    },
    expand: true,
    cwd: 'public/',
    src: ['**/*.html','**/**/*.html','**/**/**/*.html','!libs/**/*.html','!libs/*.html','!libs/**/**/*.html'],
    dest: 'dist/public/'
  }
},
//copy
copy: {
  libs: {
    files: [
      // bootstrap
      {src: ['public/libs/bootstrap/dist/css/bootstrap.min.css'], dest: 'dist/public/libs/bootstrap/dist/css/bootstrap.min.css'},
      {src: ['public/libs/bootstrap/dist/js/bootstrap.min.js'], dest: 'dist/public/libs/bootstrap/dist/js/bootstrap.min.js'},
      //angular-calendar
      {src: ['public/libs/fullcalendar/dist/fullcalendar.min.css'], dest: 'dist/public/libs/fullcalendar/dist/fullcalendar.min.css'},
      {src: ['public/libs/fullcalendar/dist/fullcalendar.min.js'], dest: 'dist/public/libs/fullcalendar/dist/fullcalendar.min.js'},
      {src: ['public/libs/fullcalendar/dist/gcal.js'], dest: 'dist/public/libs/fullcalendar/dist/gcal.js'},
      //font-awesome
      {src: ['public/libs/font-awesome/css/font-awesome.min.css'], dest: 'dist/public/libs/font-awesome/css/font-awesome.min.css'},
      //jquery
      {src: ['public/libs/jquery/dist/jquery.min.js'], dest: 'dist/public/libs/jquery/dist/jquery.min.js'},
      {src: ['public/libs/jquery-ui/jquery-ui.min.js'], dest: 'dist/public/libs/jquery-ui/jquery-ui.min.js'},
      {src: ['public/libs/jquery-ui/themes/smoothness/jquery-ui.min.css'], dest: 'dist/public/libs/jquery-ui/themes/smoothness/jquery-ui.min.css'},
      //angular-core
      {src: ['public/libs/angular/angular.min.js'], dest: 'dist/public/libs/angular/angular.min.js'},
      {src: ['public/libs/angular-route/angular-route.min.js'], dest: 'dist/public/libs/angular-route/angular-route.min.js'},
      {src: ['public/libs/angular-cookies/angular-cookies.min.js'], dest: 'dist/public/libs/angular-cookies/angular-cookies.min.js'},
      //angular-forms
      {src: ['public/libs/angular-messages/angular-messages.min.js'], dest: 'dist/public/libs/angular-messages/angular-messages.min.js'},
      //angular-bootstrap
      {src: ['public/libs/angular-bootstrap/ui-bootstrap-tpls.min.js'], dest: 'dist/public/libs/angular-bootstrap/ui-bootstrap-tpls.min.js'},
      //angular-animate
      {src: ['public/libs/angular-animate/angular-animate.min.js'], dest: 'dist/public/libs/angular-animate/angular-animate.min.js'},
      //angular-material
      {src: ['public/libs/angular-aria/angular-aria.min.js'], dest: 'dist/public/libs/angular-aria/angular-aria.min.js'},
      {src: ['public/libs/angular-material/angular-material.min.js'], dest: 'dist/public/libs/angular-material/angular-material.min.js'},
      {src: ['public/libs/angular-material/angular-material.min.css'], dest: 'dist/public/libs/angular-material/angular-material.min.css'},
      //angular-growl
      {src: ['public/libs/angular-growl-v2/build/angular-growl.min.css'], dest: 'dist/public/libs/angular-growl-v2/build/angular-growl.min.css'},
      {src: ['public/libs/angular-growl-v2/build/angular-growl.min.js'], dest: 'dist/public/libs/angular-growl-v2/build/angular-growl.min.js'},
      //angular-fileupload
      {src: ['public/libs/ng-file-upload/ng-file-upload.min.js'], dest: 'dist/public/libs/ng-file-upload/ng-file-upload.min.js'},
      {src: ['public/libs/ng-file-upload/ng-file-upload-shim.min.js'], dest: 'dist/public/libs/ng-file-upload/ng-file-upload-shim.min.js'},
      //angular-image
      {src: ['public/libs/ngImgCropFullExtended/compile/minified/ng-img-crop.js'], dest: 'dist/public/libs/ngImgCropFullExtended/compile/minified/ng-img-crop.js'},
      {src: ['public/libs/ngImgCropFullExtended/compile/minified/ng-img-crop.css'], dest: 'dist/public/libs/ngImgCropFullExtended/compile/minified/ng-img-crop.css'},
      //utils
      {src: ['public/libs/moment/moment.js'], dest: 'dist/public/libs/moment/moment.js'},
      {src: ['public/libs/moment-range/dist/moment-range.min.js'], dest: 'dist/public/libs/moment-range/dist/moment-range.min.js'},

    ],
  },
  images: {
    files: [{
      expand: true,
      cwd: 'public/',
      src: ['**/*.jpg', '**/**/*.jpg','**/**/**/*.jpg','**/*.png', '**/**/*.png','**/**/**/*.png','!libs/**/*.jpg','!libs/*.jpg','!libs/**/**/*.jpg'],
      dest: 'dist/public/'
    }]
  },
  config: {
      expand:true,
      cwd: 'config/',
      src: ['*.js','*.json'],
      dest: 'dist/config/'
  },
  controllers: {
      expand:true,
      cwd: 'controllers/',
      src: ['**/*.js','*.js'],
      dest: 'dist/controllers/'
  },
  models: {
      expand:true,
      cwd: 'models/',
      src: ['*.js'],
      dest: 'dist/models/'
  },
  routes: {
      expand:true,
      cwd: 'routes/',
      src: ['*.js'],
      dest: 'dist/routes/'
  },
   scripts: {
      expand:true,
      cwd: 'scripts/',
      src: ['*.js'],
      dest: 'dist/scripts/'
  },
   services: {
      expand:true,
      cwd: 'services/',
      src: ['*.js'],
      dest: 'dist/services/'
  },
   
   views: {
      expand:true,
      cwd: 'views/',
      src: ['*.ejs', '**/*.ejs', '**/**/*.ejs','**/*.js'],
      dest: 'dist/views/'
  },
   server: {src: ['server.js'], dest: 'dist/server.js'}
},
cssmin: {
  build:{
      expand: true,
      cwd: 'public/',
      src: ['**/*.css', '**/**/*.css','**/**/**/*.css','!libs/**/*.css','!libs/*.css','!libs/**/**/*.css'],
      dest: 'dist/public/',
      ext: '.min.css'
    }
     
}

	});  //initconfig closed
grunt.loadNpmTasks('grunt-minify-html');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.registerTask('default',['copy','uglify','minifyHtml','cssmin']  );
};
