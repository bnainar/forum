const mylogger = (server, _, next) => {
  console.log("inside mylogger install")
  server.ext({
    type: "onPreAuth",
    method: function (req, reply) {
      console.log("onPreAuth", { path: req.path });
      return reply.continue();
    },
  });
  server.ext({
    type: "onPostAuth",
    method: function (_, reply) {
      console.log("onPostAuth");
      return reply.continue();
    },
  });
  next();
};
mylogger.attributes = {
  name: "mylogger",
  version: "2",
};
module.exports = mylogger;
