const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('dev', ['server'], () => {
    return nodemon({
        ext: 'js',
        tasks: ['server'],
        script: 'gulpfile.js',
    });
});

gulp.task('server', () => {
    let config = null;
    return Promise.resolve()
        .then(() => {
            return require('./server/config/app.config.js')
                .init('127.0.0.1', 3001);
        })
        .then((_config) => {
            config = _config;
            return require('./server/db').init(config.connectionString);
        })
        .then((db) => require('./server/data').init(db))
        .then((data) => {
            data.sessionStoreName = config.sessionStoreName;
            return require('./server/app').init(data);
        })
        .then((app) => {
            app.listen(config.port, () =>
                console.log(`Server running at: ${config.port}`));
        });
});

const del = require('del');

gulp.task('clear:html', () => {
    return del(['./public/**/*.html']);
});

gulp.task('compile:html', ['clear:html'], () => {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('./public'));
});

const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

gulp.task('clear:js', () => {
    return del(['./public/js/*.js']);
});

gulp.task('compile:js', ['clear:js'], () => {
    return gulp.src(['./app/js/**/*.js'])
        .pipe(babel({
            presets: ['env'],
        }))
        //.pipe(concat('min.app.js'))
        .pipe(uglify({
            mangle: {
                toplevel: true,
            },
        }))
        .pipe(gulp.dest('./public/js/'));
});

const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

gulp.task('clear:css', () => {
    return del(['./public/css/*.css']);
});

gulp.task('compile:css', ['clear:css'], () => {
    const plugins = [
        autoprefixer({
            browsers: ['last 1 version'],
        }),
        cssnano({ minifyFontValues: false, discardUnused: false }),
    ];
    return gulp.src('./app/css/*.styl')
        .pipe(stylus())
        .pipe(postcss(plugins))
        .pipe(concat('min.main.css'))
        .pipe(gulp.dest('./public/css'));
});
const eslint = require('gulp-eslint');

gulp.task('lint:server', () => {
    return gulp.src(['./server/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint:browser', () => {
    return gulp.src(['./app/**/*.js'])
        .pipe(eslint({
            globals: [
                'jQuery',
                '$',
            ],
            envs: [
                'browser',
            ],
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint:server', 'lint:browser']);

gulp.task('clear:fonts', () => {
    return del(['./public/css/fonts/*']);
});

gulp.task( 'copy:fonts', ['clear:fonts'], () => {
    return gulp.src( ['./app/css/fonts/*'] )
        .pipe( gulp.dest('./public/css/fonts') );
});

gulp.task('clear:images', () => {
    return del(['./public/images/*']);
});

gulp.task( 'copy:images', ['clear:fonts'], () => {
    return gulp.src( ['./app/images/*'] )
        .pipe( gulp.dest('./public/images') );
});

gulp.task('clear:templates', () => {
    return del(['./public/templates/**/*']);
});

gulp.task( 'copy:templates', ['clear:templates'], () => {
    return gulp.src( ['./app/templates/**/*'] )
        .pipe( gulp.dest('./public/templates') );
});

gulp.task('clear:uploads', () => {
    return del(['./public/uploads/**/*']);
});

gulp.task( 'copy:uploads', ['clear:uploads'], () => {
    return gulp.src( ['./app/uploads/**/*'] )
        .pipe( gulp.dest('./public/uploads') );
});

gulp.task( 'copy:uploads_prod', () => {
    return gulp.src( ['./app/uploads/users/user.png', './app/uploads/users/nikolay.jpeg'] )
        .pipe( gulp.dest('./public/uploads/users') );
});

gulp.task( 'copy', [
    'copy:fonts',
    'copy:images',
    'copy:templates',
    'copy:uploads',
]);

gulp.task( 'copy_prod', [
    'copy:fonts',
    'copy:images',
    'copy:templates',
    'copy:uploads_prod',
]);

const gulpsync = require('gulp-sync')(gulp);

gulp.task('compile',
    gulpsync.sync([
        'lint',
        'compile:html',
        'compile:js',
        'compile:css',
    ]));

gulp.task( 'build_dev', ['copy', 'compile'], () => {
    const beep = '\007';
    console.log( beep ); //beep
} );

gulp.task( 'build', ['copy_prod', 'compile'] );