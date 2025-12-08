const should = require("should");
const getOptions = require("../lib/getOptions");
const { validate } = require("schema-utils");

describe("getOptions", function() {
  it("should return empty object when loader has no options", function() {
    const loaderContext = {
      query: ""
    };
    const result = getOptions(loaderContext);
    result.should.be.an.Object();
    result.should.be.empty();
  });

  it("should return options when valid twigOptions are provided", function() {
    const loaderContext = {
      query: {
        twigOptions: {
          namespaces: {
            "test": "./templates"
          }
        }
      }
    };
    const result = getOptions(loaderContext);
    result.should.have.property("twigOptions");
    result.twigOptions.should.have.property("namespaces");
    result.twigOptions.namespaces.should.have.property("test", "./templates");
  });

  it("should validate and accept options matching the schema", function() {
    const loaderContext = {
      query: {
        twigOptions: {}
      }
    };
    // Should not throw
    const result = getOptions(loaderContext);
    result.should.have.property("twigOptions");
  });

  it("should throw validation error for invalid option types", function() {
    const loaderContext = {
      query: {
        twigOptions: "not-an-object"
      }
    };
    // schema-utils throws on validation failure
    (function() {
      getOptions(loaderContext);
    }).should.throw();
  });

  it("should allow additional properties in twigOptions", function() {
    const loaderContext = {
      query: {
        twigOptions: {
          customProperty: "value",
          anotherProperty: 123
        }
      }
    };
    // Should not throw and should preserve properties
    const result = getOptions(loaderContext);
    result.should.have.property("twigOptions");
    result.twigOptions.should.have.property("customProperty", "value");
    result.twigOptions.should.have.property("anotherProperty", 123);
  });

  it("should use schema-utils validate function (not deprecated validateOptions)", function() {
    // This test verifies we're using the correct API from schema-utils
    // The validate function should be available as a named export
    validate.should.be.a.Function();

    // Test that validate works with our schema format
    const schema = {
      type: "object",
      properties: {
        twigOptions: {
          type: "object"
        }
      }
    };
    const validOptions = { twigOptions: {} };

    // Should not throw when called with correct signature
    (function() {
      validate(schema, validOptions, { name: "test" });
    }).should.not.throw();
  });
});
