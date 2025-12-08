const { getOptions } = require("loader-utils");
const { validate } = require("schema-utils");

const schema = {
  type: "object",
  properties: {
    twigOptions: {
      type: "object",
    },
  },
};

module.exports = function (loader) {
  const options = getOptions(loader);
  if (!options) {
    return {};
  }
  validate(schema, options, { name: "twig-loader" });
  return options;
};
