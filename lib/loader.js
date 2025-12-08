const Twig = require("twig");
const hashGenerator = require("hasha");
const mapcache = require("./mapcache");
const compilerFactory = require("./compiler");
const getOptions = require("./getOptions");
Twig.cache(false);

module.exports = function (source) {
  const path = require.resolve(this.resource);
  const id = hashGenerator(path);
  const options = getOptions(this);
  let tpl;

  Twig.extend(function (twigInstance) {
    const { compiler } = twigInstance;
    compiler.module["webpack"] = compilerFactory(options);
  });

  mapcache.set(id, path);

  this.cacheable?.();

  tpl = Twig.twig({
    id,
    path,
    data: source,
    allowInlineIncludes: true,
  });

  tpl = tpl.compile({
    module: "webpack",
    twig: "twig",
  });

  this.callback(null, tpl);
};
