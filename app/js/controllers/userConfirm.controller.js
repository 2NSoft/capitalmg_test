/* globals $ toastr */

import { load as loadTemplate } from 'templates';
import { setActiveLink } from 'navUtils';
import user from 'user';
import data from 'data';

const $appContainer = $('#app-container');
let $details;
let $select;
let $fullname;
let $email;
let $role;

const updateUserDetails = () => {
    const currUser = users
        .find((usr) => $select.val() === usr.id);
    if (!currUser) {
        $details.hide(500);
        $details
            .children()
            .each((index, control) => {
                $(control).val('');
            });
        return false;
    }
    $fullname.val(`${currUser.firstname} ${currUser.lastname}`);
    $email.val(currUser.email);
    $role.children('[selected]').prop('selected', true);
    $role.children('[id=""]').prop('selected', true);
    $details.children('button').prop('disabled', true);
    $details.show(500);
    return true;
};

const updateButtonState = () => {
    $details
        .children('button')
        .prop('disabled', $role.val() === '');
};

let users = [];

export function get(router) {
    return user.checkStatus()
        .then((currUser) => {
            if (!currUser.role === 'administrator') {
                router.navigate('/unauthorized');
                return Promise.reject('Unauthorized access attempted!');
            }
            return data.getUserConfirmData();
        })
        .then((userConfirmData) => {
            users = userConfirmData.users;
            return loadTemplate('pages/user.confirm', userConfirmData);
        })
        .then((pageTemplate) => {
            $appContainer.html(pageTemplate);
            setActiveLink('Users');

            $details = $('#user-details');
            $fullname = $('#user-fullname');
            $email = $('#user-email');
            $role = $('#user-role');
            $select = $('#user-select');

            $role.on('change', updateButtonState);
            $select.on('change', updateUserDetails);
            updateUserDetails();
            $('form').submit( (ev) => {
                ev.preventDefault();
                const roleInfo = {
                    userId: $select.val(),
                    role: $role.val(),
                    updateRole: true,
                };
                data.updateUserRole( roleInfo )
                    .then( (userId) => {
                        users.splice(
                            users.findIndex( (usr) => {
                                return usr.id === userId;
                            }), 1 );
                        $select.children(`[value=${userId}]`).remove();
                        $select.children().eq(0).prop('selected', true );
                        updateUserDetails();
                        toastr.success('User successfully updated!');
                    })
                    .catch( (err) => {
                        toastr.error( err, 'Could not set role!');
                    });
            });
        });
}
