/* globals jQuery */
/* eslint-disable no-invalid-this */
( ($) => {
    $.fn.disable = function() {
        this.prop('disabled', true);
        return this;
    };
    $.fn.enable = function() {
        this.prop('disabled', false);
        return this;
    };
})(jQuery);

/* eslint-enable no-invalid-this */

