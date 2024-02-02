const db = require("./models");
const {User} = require("./models")
const Hapi = require("hapi");
const elastic = require("@elastic/elasticsearch");
const el = new elastic.Client({ node: "http://elasticsearch:9200" });
const server = new Hapi.Server();
server.connection({
  host: "0.0.0.0",
  port: 3000,
});

server.route({
  path: "/titles",
  method: "POST",
  handler: async (req, res) => {
    try {
      const elres = await el.index({
        index: 'my-index',
        type: '_doc', 
        body: req.payload
      })
      res(elres);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  },
});
server.route({
  path: "/search",
  method: "POST",
  handler: async (req, res) => {
    const s = await el.search({index: 'my-index', body: {query: {match: req.payload}}})
    res(s?.body?.hits?.hits)
  }
})

server.route({
  path: "/",
  method: "GET",
  handler: (req, h) => h("OK"),
});

server.route({
  path: "/users",
  method: "GET",
  handler: (req, h) => User.findAll().then(h),
});

server.route({
  path: "/users/{id}",
  method: "GET",
  handler: async (req, reply) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return reply().code(404);
    }
    reply(user)
  },
});

server.route({
  path: "/users/{id}",
  method: "PATCH",
  handler: async (req, reply) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return reply().code(404);
    }
    user.name = req.payload.name;
    await user.save();
    reply(user);
  },
});
server.route({
  path: "/users/{id}",
  method: "DELETE",
  handler: async (req, reply) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return reply().code(404);
    }
    await user.destroy();
    reply(user);
  },
});
server.route({
  path: "/users",
  method: ["PUT", "POST"],
  handler: async (req, h) => h(await User.create(req.payload)).code(201),
});

server.start(async (err) => {
  if (err) throw err;
  console.log("Server running");
  try {
    await db.sequelize.authenticate();
    console.log("DB connected successfully");
  } catch (e) {
    console.log("DB conn failed", e);
    process.exit(1);
  }
  
  server.on("response", function (req) {
    console.log(
        req.method.toUpperCase() + " " + req.path + " → " + req.response.statusCode
    );
  })
});