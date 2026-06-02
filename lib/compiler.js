const fs = require("fs");
const path = require("path");
const hashGenerator = require("hasha");
const mapcache = require("./mapcache");

module.exports = function (options) {
  return function (id, tokens, pathToTwig) {
    const includes = [];
    const resourcePath = mapcache.get(id);
    const processDependency = (token) => {
      if (options.twigOptions && options.twigOptions.namespaces) {
        const { namespaces } = options.twigOptions;
        Object.keys(namespaces).forEach((ns) => {
          const doubleColon = new RegExp("^" + ns + "::");
          const singleColon = new RegExp("^" + ns + ":");
          const atSign = new RegExp("^@" + ns);

          if (doubleColon.test(token.value)) {
            token.value = token.value.replace(ns + "::", namespaces[ns]);
          } else if (singleColon.test(token.value)) {
            const componentName = token.value.replace(ns + ":", "");
            const nsBase = namespaces[ns];
            const subdirs = options.sdcSubdirectories || ["", "layouts", "components", "templates"];
            const resourceDir = path.dirname(resourcePath);
            const resolved = subdirs
              .map((sub) =>
                sub
                  ? `${nsBase}/${sub}/${componentName}/${componentName}.twig`
                  : `${nsBase}/${componentName}/${componentName}.twig`
              )
              .find((candidate) =>
                fs.existsSync(path.resolve(resourceDir, candidate))
              );
            token.value = resolved || `${nsBase}/${componentName}/${componentName}.twig`;
          } else if (atSign.test(token.value)) {
            token.value = token.value.replace("@" + ns, namespaces[ns]);
          }
        });
      }

      includes.push(token.value);
      token.value = hashGenerator(
        path.resolve(path.dirname(resourcePath), token.value),
      );
    };

    const processToken = (token) => {
      if (token.type === "logic" && token.token.type) {
        switch (token.token.type) {
          case "Twig.logic.type.block":
          case "Twig.logic.type.if":
          case "Twig.logic.type.elseif":
          case "Twig.logic.type.else":
          case "Twig.logic.type.for":
          case "Twig.logic.type.spaceless":
          case "Twig.logic.type.setcapture":
          case "Twig.logic.type.macro":
            token.token.output.forEach(processToken);
            break;
          case "Twig.logic.type.extends":
          case "Twig.logic.type.include":
            token.token.stack.forEach(processDependency);
            break;
          case "Twig.logic.type.embed":
            token.token.output.forEach(processToken);
            token.token.stack.forEach(processDependency);
            break;
          case "Twig.logic.type.import":
          case "Twig.logic.type.from":
            if (token.token.expression !== "_self") {
              token.token.stack.forEach(processDependency);
            }
            break;
        }
      }
    };

    const parsedTokens = JSON.parse(tokens);

    parsedTokens.forEach(processToken);

    const opts = Object.assign({}, options.twigOptions, {
      id,
      data: parsedTokens,
      allowInlineIncludes: true,
      rethrow: true,
    });
    const output = [
      `var twig = require("${pathToTwig}").twig,`,
      "    template = twig(" + JSON.stringify(opts) + ");\n",
      "module.exports = function(context) { return template.render(context); }",
    ];

    if (includes.length > 0) {
      [...new Set(includes)].forEach((file) => {
        output.unshift("require(" + JSON.stringify(file) + ");\n");
      });
    }

    return output.join("\n");
  };
};
