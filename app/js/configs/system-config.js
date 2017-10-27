/* globals System */
/* eslint-disable max-len */
System.config({
    transpiler: 'plugin-babel',
    map: {
        // System.js files
        'plugin-babel': './libs/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build':
            './libs/systemjs-plugin-babel/systemjs-babel-browser.js',

        // App files
        'app': 'js/app.js',
        'templates': 'js/utils/templates.js',
        'data': 'js/utils/data.js',
        'user': 'js/utils/user.js',
        'navUtils': 'js/utils/navUtils.js',
        'jQueryFills': 'js/utils/jQueryFills.js',
        'copyObject': 'js/utils/copyObject.js',
        'validator': 'js/helpers/validator.js',
        'quoteHelper': 'js/helpers/quote.helper.js',

        // Controllers
        'homeController': 'js/controllers/home.controller.js',
        'signinController': 'js/controllers/signin.controller.js',
        'userConfirmController': 'js/controllers/userConfirm.controller.js',
        'examQuestionsController': 'js/controllers/exam.questions.controller.js',
        'courseCreateController': 'js/controllers/course.create.controller.js',
        'registerController': 'js/controllers/register.controller.js',

        // Library files
        'jquery': './libs/jquery/dist/jquery.min.js',
        'jqueryui': './libs/jqueryui/jquery-ui.min.js',
        'navigo': './libs/navigo/lib/navigo.min.js',
        'handlebars': './libs/handlebars/dist/handlebars.min.js',
        'toastr': './libs/toastr/build/toastr.min.js',
        'date': './libs/dateformat/lib/dateformat.js',
    },
});

System.import('app');
