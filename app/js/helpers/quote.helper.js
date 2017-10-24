/* globals $ */
import Handlebars from 'handlebars';

const registerQuote = () => {
    return $.get(`templates/quote.handlebars`)
        .then( (template) => {
            return Promise
                .resolve( Handlebars.registerPartial('quote', template ));
        });
};

module.exports = { registerQuote };
