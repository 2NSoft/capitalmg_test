/* globals $ toastr */

// Routers
import Navigo from 'navigo';

// Users
import user from 'user';

// Helpers & Utils
// import {VALIDATOR as VALIDATOR} from 'validator';
import { setPrivateLinks } from 'navUtils';


// Polyfill jQuery
import 'jQueryFills';


// Controllers
import { get as homeController } from 'homeController';
import { get as signinController } from 'signinController';
import { get as registerController } from 'registerController';
import { get as examQuestionsController } from 'examQuestionsController';
import { get as examCreateController } from 'examCreateController';
import { get as courseCreateController } from 'courseCreateController';
import { get as userConfirmController } from 'userConfirmController';
import { get as courseEnrollController } from 'courseEnrollController';
import { get as examEnrollController } from 'examEnrollController';
import { get as examCheckInController } from 'examCheckInController';
import { get as examOverviewController } from 'examOverviewController';
import { get as examinerController } from 'examinerController';

// Navigo setup
const root = null;
const useHash = true;
const hash = '#';
const router = new Navigo(root, useHash, hash);

// Setting up routes
router
    .on('/', () => {
        router.navigate('/home');
    })
    .on('/home', () => {
        return homeController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/signin', () => {
        return signinController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/register', () => {
        return registerController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/admin/users/confirm', () => {
        return userConfirmController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/admin/courses/create', () => {
        return courseCreateController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/docent/exam/questions', () => {
        return examQuestionsController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/docent/exam/create', () => {
        return examCreateController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/docsecretary/course/:id', (params) => {
        return courseEnrollController(params, router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/docsecretary/exam/:id', (params) => {
        return examEnrollController(params, router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/docassistant/exam/:id/:slot', (params) => {
        return examCheckInController(params, router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/student/exams', () => {
        return examOverviewController(router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .on('/student/examiner/:id', (params) => {
        return examinerController(params, router)
            .then(() => {
                router.updatePageLinks();
            })
            .catch((err) => {
                toastr.error(err);
            });
    })
    .notFound(() => {
        console.log('Not found');
    })
    .resolve();

let initial = true;
user.onStatusChange = (usr) => {
    const signInBtn = $('#sign-in-btn');
    const registerBtn = $('#register-btn');
    if (usr.signedIn) {
        registerBtn.hide();
        signInBtn.text('Sign out');
        signInBtn.attr('href', '/home');
        if (!initial) {
            router.navigate('/home');
        } else {
            initial = false;
        }
    } else {
        registerBtn.show();
        signInBtn.text('Sign in');
        signInBtn.attr('href', '/signin');
    }
    setPrivateLinks(user.role, router);
};

user.checkStatus(true);

$('#sign-in-btn').click((ev) => {
    if ($('#sign-in-btn').text() === 'Sign out') {
        ev.preventDefault();
        user.signOut();
    }
});

$('.navbar-collapse ul').on('click', (ev) => {
    $(ev.currentTarget)
        .find('.isActive')
        .removeClass('isActive');
    $(ev.target).addClass('isActive');
});

export {
    router,
};
