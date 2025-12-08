const should = require("should");

const fs = require("fs");
const path = require("path");

const runLoader = require("./fakeModuleSystem");
const twigLoader = require("../");

const fixtures = path.join(__dirname, "fixtures");

describe("from", function() {
  it("should generate correct code", function(done) {
    const template = path.join(fixtures, "from", "template.html.twig");
    runLoader(twigLoader, path.join(fixtures, "from"), template, fs.readFileSync(template, "utf-8"), (err, result) => {
      if(err) throw err;

      result.should.have.type("string");

      // verify the generated module imports the `from`d templates
      result.should.match(/require\(\"\.\/a\.html\.twig\"\);/);
      result.should.match(/require\(\"\.\/b\.html\.twig\"\);/);
      result.should.match(/require\(\"\.\/c\.html\.twig\"\);/);
      result.should.match(/require\(\"\.\/d\.html\.twig\"\);/);
      result.should.match(/require\(\"\.\/e\.html\.twig\"\);/);
      result.should.match(/require\(\"\.\/f\.html\.twig\"\);/);
      result.should.match(/require\(\"\.\/g\.html\.twig\"\);/);
      result.should.match(/require\(\"\.\/h\.html\.twig\"\);/);

      done();
    });
  });
});
