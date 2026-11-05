const crypto = require("crypto");

// Matches hasha's defaults (sha512, hex) so generated template IDs are unchanged.
module.exports = function (input) {
  return crypto.createHash("sha512").update(input).digest("hex");
};
