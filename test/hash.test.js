const should = require("should");
const crypto = require("crypto");
const hash = require("../lib/hash");

describe("hash", function () {
  it("should return a sha512 hex digest (compatible with the former hasha default)", function () {
    // Known sha512("abc"); guards against changing algorithm/encoding, which would change template IDs.
    hash("abc").should.equal(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
    );
  });

  it("should be deterministic and match crypto directly", function () {
    const input = "/path/to/template.twig";
    hash(input).should.equal(hash(input));
    hash(input).should.equal(
      crypto.createHash("sha512").update(input).digest("hex"),
    );
  });

  it("should produce different hashes for different paths", function () {
    hash("/a/b.twig").should.not.equal(hash("/a/c.twig"));
  });
});
