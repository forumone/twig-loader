const should = require("should");

const fs = require("fs");
const path = require("path");

const runLoader = require("./fakeModuleSystem");
const twigLoader = require("../");

const fixtures = path.join(__dirname, "fixtures");

describe("embed", function() {
  it("should generate proper require embed tag", function(done) {
    const template = path.join(fixtures, "embed", "template.html.twig");
    runLoader(twigLoader, path.join(fixtures, "extend"), template, fs.readFileSync(template, "utf-8"), (err, result) => {
      if(err) throw err;

      result.should.have.type("string");

      // verify the generated module imports the `embed`d templates
      result.should.match(/require\(\"embed\.html\.twig\"\);/);

      done();
    });
  });

  it("should generate proper require include tag in block tag", function(done) {
    const template = path.join(fixtures, "embed", "template.html.twig");
    runLoader(twigLoader, path.join(fixtures, "extend"), template, fs.readFileSync(template, "utf-8"), (err, result) => {
      if(err) throw err;

      result.should.have.type("string");

      // verify the generated module imports the `include`d templates
      result.should.match(/require\(\"include\.html\.twig\"\);/);

      done();
    });
  });
});
