const should = require("should");

const fs = require("fs");
const path = require("path");

const runLoader = require("./fakeModuleSystem");
const twigLoader = require("../");

const fixtures = path.join(__dirname, "fixtures");

describe("extend", function() {
  it("should generate proper require statements", function(done) {
    const template = path.join(fixtures, "extend", "template.html.twig");
    runLoader(twigLoader, path.join(fixtures, "extend"), template, fs.readFileSync(template, "utf-8"), (err, result) => {
      if(err) throw err;

      result.should.have.type("string");

      // verify the generated module imports the `include`d templates
      result.should.match(/require\(\"a\.html\.twig\"\);/);

      done();
    });
  });
});
