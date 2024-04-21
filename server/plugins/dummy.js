const mylogger = (server, _, next) => {
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
  name: "dummy",
  version: "1",
};
module.exports = mylogger;
