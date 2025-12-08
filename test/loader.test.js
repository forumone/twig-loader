const should = require("should");

const fs = require("fs");
const path = require("path");

const runLoader = require("./fakeModuleSystem");
const twigLoader = require("../");

const fixtures = path.join(__dirname, "fixtures");

describe("loader", function() {
  it("should add require statement to the twig library", function(done) {
    const template = path.join(fixtures, "loader", "template.html.twig");
    runLoader(twigLoader, path.join(fixtures, "loader"), template, fs.readFileSync(template, "utf-8"), (err, result) => {
      if(err) throw err;

      result.should.have.type("string");

      result.should.match(/require\("twig"\)\.twig/);

      done();
    });
  });
});
