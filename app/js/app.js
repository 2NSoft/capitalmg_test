/* globals $ toastr */

// Routers
import Navigo from 'navigo';

// Users
import user from 'user';

// Helpers
// import {VALIDATOR as VALIDATOR} from 'validator';

// Controllers
import { get as homeController } from 'homeController';
import { get as signinController } from 'signinController';
import { get as registerController } from 'registerController';

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
    .notFound(() => {
        console.log('Not found');
    })
    .resolve();

let initial = true;
user.onStatusChange = (usr) => {
    const signInBtn = $('#sign-in-btn');
    const registerBtn = $('#register-btn');
    if (usr.signedIn) {
        $('.private-menu')
            .each((index, menu) => {
                $(menu).show();
            });
        registerBtn.hide();
        signInBtn.text('Sign out');
        signInBtn.attr('href', '/home');
        if (!initial) {
            router.navigate('/home');
        } else {
            initial = false;
        }
    } else {
        $('.private-menu')
            .each((index, menu) => {
                $(menu).hide();
            });
        registerBtn.show();
        signInBtn.text('Sign in');
        signInBtn.attr('href', '/signin');
    }
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
