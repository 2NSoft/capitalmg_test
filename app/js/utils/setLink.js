/* globals $ toastr */

const $menu = $('.navbar-collapse ul');

const setActiveLink = (linkName) => {
    $menu
        .children()
        .each( (index, item) => {
            const link = $($(item).find('a').eq(0));
            if (link.text()===linkName) {
                link.addClass('isActive');
            } else {
                link.removeClass('isActive');
            }
        });
};

module.exports = { setActiveLink };
