const dummy = (server, _, next) => {
  console.log("inside dummy registeration")
  server.ext("onPostAuth", (req, reply) => {
    console.log("onPostAuth");
    reply.continue();
  });
  console.log("between dummy registeration")
  server.route({
    method: "GET",
    path: "/nainar",
    handler: (a, b) => b("nainar")
  })
  console.log("after dummy registeration")
  next();
};
dummy.attributes = {
  name: "dummy",
  version: "1",
};
module.exports = dummy;
