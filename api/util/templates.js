let path = require('path');
let fs = require('fs');

/**
 * Gets a compiled Handlebars template in the `src/templates/` directory.
 *
 * @param {string} name The name of the template (i.e. `name` if
 *                      `src/templates/name.js` is the template's location).
 * @return {string} The uncompiled Handlebars template, or an empty string
 *                  if the specified template cannot be found.
 */
module.exports.get = function getTemplate(name) {
    if (!name) return () => { return ''; };

    try {
        return fs.readFileSync(path.join(
            __dirname,
            `../../src/templates/${name}.hbs`,
        )).toString('utf-8');
    } catch (error) {
        return '';
    }
};
