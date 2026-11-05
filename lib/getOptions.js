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
  // loader-utils >= 2 dropped getOptions; webpack 5 provides loader.getOptions().
  // Fall back to loader.query (object form) for older contexts and test mocks.
  const options =
    typeof loader.getOptions === "function"
      ? loader.getOptions()
      : loader.query;
  if (!options || typeof options !== "object") {
    return {};
  }
  validate(schema, options, { name: "twig-loader" });
  return options;
};
