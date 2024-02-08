const db = require("./models");
const Hapi = require("hapi");
const route = require("./routes");
const utils = require("./utils");
const server = new Hapi.Server();
server.connection({
  host: "0.0.0.0",
  port: 3000,
});

server.start(async (err) => {
  if (err) throw err;
  console.log("Server running");
  try {
    const flatRoutes = [];
    for (const key in route) {
      if (route[key].length > 0) {
        const routes = route[key];
        flatRoutes.push(...routes);
      }
    }
    server.auth.scheme("cookie-scheme", () => {
      return {
        authenticate: async (req, reply) => {
          try {
            const cache = await utils.redis();
            const userId = await cache.get(req.state.session);
            if (!userId) return reply().code(401);
            reply.continue({ credentials: { userId } });
          } catch (e) {
            console.log("auth fail", e);
            return reply().code(500);
          }
        },
      };
    });
    server.auth.strategy("cookie-auth", "cookie-scheme");
    server.route(flatRoutes);

    await db.sequelize.authenticate();
    await db.sequelize.sync();
    console.log("DB connected successfully");
  } catch (e) {
    console.log("DB conn failed", e);
    process.exit(1);
  }

  server.on("response", function (req) {
    console.log(
      req.method.toUpperCase() +
        " " +
        req.path +
        " → " +
        req.response.statusCode
    );
  });
});
