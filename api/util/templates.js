let path = require('path');
let fs = require('fs');
let handlebars = require('handlebars');

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
