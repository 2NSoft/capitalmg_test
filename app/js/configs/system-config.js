/* globals System */
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
        'setLink': 'js/utils/setLink.js',
        'validator': 'js/helpers/validator.js',
        'quoteHelper': 'js/helpers/quote.helper.js',

        // Controllers
        'homeController': 'js/controllers/home.controller.js',
        'signinController': 'js/controllers/signin.controller.js',
        'registerController': 'js/controllers/register.controller.js',

        // Library files
        'jquery': './libs/jquery/dist/jquery.min.js',
        'navigo': './libs/navigo/lib/navigo.min.js',
        'handlebars': './libs/handlebars/dist/handlebars.min.js',
        'toastr': './libs/toastr/build/toastr.min.js',
        'date': './libs/dateformat/lib/dateformat.js',
    },
});

System.import('app');
