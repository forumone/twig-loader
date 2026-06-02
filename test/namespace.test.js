const should = require("should");

const fs = require("fs");
const path = require("path");

const runLoader = require("./fakeModuleSystem");
const twigLoader = require("../");

const fixtures = path.join(__dirname, "fixtures");

describe("namespace", function() {
  it("should resolve single-colon namespace syntax (Drupal SDC)", function(done) {
    const template = path.join(fixtures, "namespace", "template.html.twig");
    const loaderContext = {
      async: function() {
        return (err, result) => {
          if(err) throw err;

          result.should.have.type("string");

          // Single colon syntax should resolve to component-name/component-name.twig
          // gesso:page-title -> gesso/page-title/page-title.twig
          result.should.match(/require\("\.\/gesso\/page-title\/page-title\.twig"\);/);

          // gesso:card -> gesso/card/card.twig
          result.should.match(/require\("\.\/gesso\/card\/card\.twig"\);/);

          done();
        };
      },
      loaders: ["itself"],
      loaderIndex: 0,
      query: {
        twigOptions: {
          namespaces: {
            "gesso": "./gesso"
          }
        }
      },
      resource: template,
      callback: function(err, result) {
        if(err) throw err;

        result.should.have.type("string");

        // Single colon syntax should resolve to component-name/component-name.twig
        // gesso:page-title -> gesso/page-title/page-title.twig
        result.should.match(/require\("\.\/gesso\/page-title\/page-title\.twig"\);/);

        // gesso:card -> gesso/card/card.twig
        result.should.match(/require\("\.\/gesso\/card\/card\.twig"\);/);

        done();
      },
      resolve: function(context, request, callback) {
        callback(null, path.resolve(context, request));
      },
      loadModule: function(request, callback) {
        request = request.replace(/^-?!+/, "");
        request = request.split("!");
        const content = fs.readFileSync(request.pop(), "utf-8");
        if(request[0] && /stringify/.test(request[0]))
          content = JSON.stringify(content);
        return callback(null, content);
      }
    };

    const content = fs.readFileSync(template, "utf-8");
    twigLoader.call(loaderContext, content);
  });

  it("should handle single-colon syntax with hyphens in component names", function(done) {
    const template = path.join(fixtures, "namespace", "template.html.twig");
    const loaderContext = {
      async: function() {
        return (err, result) => {
          if(err) throw err;

          result.should.have.type("string");

          // gesso:page-title should correctly resolve with hyphenated name
          result.should.match(/require\("\.\/gesso\/page-title\/page-title\.twig"\);/);

          done();
        };
      },
      loaders: ["itself"],
      loaderIndex: 0,
      query: {
        twigOptions: {
          namespaces: {
            "gesso": "./gesso"
          }
        }
      },
      resource: template,
      callback: function(err, result) {
        if(err) throw err;

        result.should.have.type("string");

        // gesso:page-title should correctly resolve with hyphenated name
        result.should.match(/require\("\.\/gesso\/page-title\/page-title\.twig"\);/);

        done();
      },
      resolve: function(context, request, callback) {
        callback(null, path.resolve(context, request));
      },
      loadModule: function(request, callback) {
        request = request.replace(/^-?!+/, "");
        request = request.split("!");
        let content = fs.readFileSync(request.pop(), "utf-8");
        if(request[0] && /stringify/.test(request[0]))
          content = JSON.stringify(content);
        return callback(null, content);
      }
    };

    const content = fs.readFileSync(template, "utf-8");
    twigLoader.call(loaderContext, content);
  });

  it("should handle multiple single-colon components in same template", function(done) {
    const template = path.join(fixtures, "namespace", "template.html.twig");
    const loaderContext = {
      async: function() {
        return (err, result) => {
          if(err) throw err;

          result.should.have.type("string");

          // Verify both single-colon includes are resolved correctly
          result.should.match(/require\("\.\/gesso\/page-title\/page-title\.twig"\);/);
          result.should.match(/require\("\.\/gesso\/card\/card\.twig"\);/);

          done();
        };
      },
      loaders: ["itself"],
      loaderIndex: 0,
      query: {
        twigOptions: {
          namespaces: {
            "gesso": "./gesso"
          }
        }
      },
      resource: template,
      callback: function(err, result) {
        if(err) throw err;

        result.should.have.type("string");

        // Verify both single-colon includes are resolved correctly
        result.should.match(/require\("\.\/gesso\/page-title\/page-title\.twig"\);/);
        result.should.match(/require\("\.\/gesso\/card\/card\.twig"\);/);

        done();
      },
      resolve: function(context, request, callback) {
        callback(null, path.resolve(context, request));
      },
      loadModule: function(request, callback) {
        request = request.replace(/^-?!+/, "");
        request = request.split("!");
        let content = fs.readFileSync(request.pop(), "utf-8");
        if(request[0] && /stringify/.test(request[0]))
          content = JSON.stringify(content);
        return callback(null, content);
      }
    };

    const content = fs.readFileSync(template, "utf-8");
    twigLoader.call(loaderContext, content);
  });

  it("should resolve single-colon syntax in a 'components' subdirectory", function(done) {
    const template = path.join(fixtures, "namespace", "subdirectory-template.html.twig");
    const loaderContext = {
      async: function() {
        return (err, result) => {
          if(err) throw err;
          // gesso:messages lives at gesso/components/messages/messages.twig
          result.should.match(/require\("\.\/gesso\/components\/messages\/messages\.twig"\);/);
          done();
        };
      },
      loaders: ["itself"],
      loaderIndex: 0,
      query: {
        twigOptions: {
          namespaces: {
            "gesso": "./gesso"
          }
        }
      },
      resource: template,
      callback: function(err, result) {
        if(err) throw err;
        result.should.match(/require\("\.\/gesso\/components\/messages\/messages\.twig"\);/);
        done();
      },
      resolve: function(context, request, callback) {
        callback(null, path.resolve(context, request));
      },
      loadModule: function(request, callback) {
        request = request.replace(/^-?!+/, "");
        request = request.split("!");
        let content = fs.readFileSync(request.pop(), "utf-8");
        if(request[0] && /stringify/.test(request[0]))
          content = JSON.stringify(content);
        return callback(null, content);
      }
    };

    const content = fs.readFileSync(template, "utf-8");
    twigLoader.call(loaderContext, content);
  });

  it("should resolve single-colon syntax in a 'templates' subdirectory", function(done) {
    const template = path.join(fixtures, "namespace", "subdirectory-template.html.twig");
    const loaderContext = {
      async: function() {
        return (err, result) => {
          if(err) throw err;
          // gesso:alerts lives at gesso/templates/alerts/alerts.twig
          result.should.match(/require\("\.\/gesso\/templates\/alerts\/alerts\.twig"\);/);
          done();
        };
      },
      loaders: ["itself"],
      loaderIndex: 0,
      query: {
        twigOptions: {
          namespaces: {
            "gesso": "./gesso"
          }
        }
      },
      resource: template,
      callback: function(err, result) {
        if(err) throw err;
        result.should.match(/require\("\.\/gesso\/templates\/alerts\/alerts\.twig"\);/);
        done();
      },
      resolve: function(context, request, callback) {
        callback(null, path.resolve(context, request));
      },
      loadModule: function(request, callback) {
        request = request.replace(/^-?!+/, "");
        request = request.split("!");
        let content = fs.readFileSync(request.pop(), "utf-8");
        if(request[0] && /stringify/.test(request[0]))
          content = JSON.stringify(content);
        return callback(null, content);
      }
    };

    const content = fs.readFileSync(template, "utf-8");
    twigLoader.call(loaderContext, content);
  });

  it("should use custom sdcSubdirectories when provided", function(done) {
    const template = path.join(fixtures, "namespace", "subdirectory-template.html.twig");
    const loaderContext = {
      async: function() {
        return (err, result) => {
          if(err) throw err;
          // With sdcSubdirectories: ["components"], messages resolves via components/
          result.should.match(/require\("\.\/gesso\/components\/messages\/messages\.twig"\);/);
          done();
        };
      },
      loaders: ["itself"],
      loaderIndex: 0,
      query: {
        twigOptions: {
          namespaces: {
            "gesso": "./gesso"
          }
        },
        sdcSubdirectories: ["components"]
      },
      resource: template,
      callback: function(err, result) {
        if(err) throw err;
        result.should.match(/require\("\.\/gesso\/components\/messages\/messages\.twig"\);/);
        done();
      },
      resolve: function(context, request, callback) {
        callback(null, path.resolve(context, request));
      },
      loadModule: function(request, callback) {
        request = request.replace(/^-?!+/, "");
        request = request.split("!");
        let content = fs.readFileSync(request.pop(), "utf-8");
        if(request[0] && /stringify/.test(request[0]))
          content = JSON.stringify(content);
        return callback(null, content);
      }
    };

    const content = fs.readFileSync(template, "utf-8");
    twigLoader.call(loaderContext, content);
  });

  it("should resolve single-colon syntax in a 'layouts' subdirectory", function(done) {
    const template = path.join(fixtures, "namespace", "subdirectory-template.html.twig");
    const loaderContext = {
      async: function() {
        return (err, result) => {
          if(err) throw err;
          // gesso:hero lives at gesso/layouts/hero/hero.twig
          result.should.match(/require\("\.\/gesso\/layouts\/hero\/hero\.twig"\);/);
          done();
        };
      },
      loaders: ["itself"],
      loaderIndex: 0,
      query: {
        twigOptions: {
          namespaces: {
            "gesso": "./gesso"
          }
        }
      },
      resource: template,
      callback: function(err, result) {
        if(err) throw err;
        result.should.match(/require\("\.\/gesso\/layouts\/hero\/hero\.twig"\);/);
        done();
      },
      resolve: function(context, request, callback) {
        callback(null, path.resolve(context, request));
      },
      loadModule: function(request, callback) {
        request = request.replace(/^-?!+/, "");
        request = request.split("!");
        let content = fs.readFileSync(request.pop(), "utf-8");
        if(request[0] && /stringify/.test(request[0]))
          content = JSON.stringify(content);
        return callback(null, content);
      }
    };

    const content = fs.readFileSync(template, "utf-8");
    twigLoader.call(loaderContext, content);
  });
});
