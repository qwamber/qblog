let path = require('path');
let fs = require('fs');
let handlebars = require('handlebars');

/**
 * Gets a compiled Handlebars template in the `src/templates/` directory.
 *
 * @param {string} name The name of the template (i.e. `name` if
 *                      `src/templates/name.js` is the template's location).
 * @return {Function} The compiled Handlebars template, or an empty template
 *                    if the specified template cannot be found.
 */
module.exports.get = function getTemplate(name) {
    if (!name) return () => { return ''; };

    try {
        return handlebars.compile(fs.readFileSync(path.join(
            __dirname,
            `../../src/templates/${name}.hbs`,
        )).toString('utf-8'));
    } catch (error) {
        return () => { return ''; };
    }
};
