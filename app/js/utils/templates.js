/* globals $ */

import Handlebars from 'handlebars';

export function load(templateName, data) {
    return $.get(`templates/${templateName}.handlebars`)
        .then(function( src ) {
            const compiledTemplate = Handlebars.compile(src)(data);
            return Promise.resolve(compiledTemplate);
        });
}
