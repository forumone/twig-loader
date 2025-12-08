const getOptions = require("loader-utils").getOptions;
const validateOptions = require("schema-utils");

const schema = {
    type: "object",
    properties: {
        twigOptions: {
            type: "object",
        },
    },
};

module.exports = function(loader) {
    const options = getOptions(loader);
    if (!options) {
        return {};
    }
    validateOptions(schema, options, "twig-loader");
    return options;
};
