const fs = require("fs");
const path = require("path");

module.exports = function runLoader(loader, directory, filename, arg, callback) {
  let async = true;
  const loaderContext = {
    async: function() {
      async = true;
      return callback;
    },
    loaders: ["itself"],
    loaderIndex: 0,
    query: "",
    resource: filename,
    callback: function() {
      async = true;
      return callback.apply(this, arguments);
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
  const res = loader.call(loaderContext, arg);
  if(!async) callback(null, res);
}
