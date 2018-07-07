/**
 * Returns the keys of an `Object` where the value is truthy.
 *
 * @param {Object} object The object to return keys from.
 * @return {Array} The truthy keys.
 */
module.exports.getTruthyKeys = function getTruthyKeysOfObject(object) {
    return Object.keys(object).filter((key) => {
        return object[key];
    });
};

/**
 * Makes an object through an array of keys and an array of values.
 *
 * @param {Array} keys The keys.
 * @param {Array} values The values.
 * @return {Object} The created object.
 */
module.exports.makeKeysAndValues = function makeObjectFromKeysAndValues(
    keys,
    values,
) {
    let result = {};

    for (let i = 0; i < keys.length; i++) {
        result[keys[i]] = values[i];
    }

    return result;
};
