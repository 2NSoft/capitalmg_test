/* globals $ toastr */

const $menu = $('.navbar-collapse ul');
const $private = $('[data-privacy]');

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

const setPrivateLinks = ( role ) => {
    $private.each((index, link) => {
        const $link = $(link);
        if ($link.attr('data-privacy') === `${role}-menu`) {
            $link.show();
        } else {
            $link.hide();
        }
    });
};

module.exports = {
    setActiveLink,
    setPrivateLinks,
 };
