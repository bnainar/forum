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
  try {
    if (err) throw err;
    console.log("Server started");
    server.auth.scheme("cookie-scheme", () => ({
      authenticate: utils.cookieAuthScheme,
    }));
    server.auth.strategy("cookie-auth", "cookie-scheme");
    const flatRoutes = [];
    for (const key in route) {
      if (route[key].length > 0) {
        const routes = route[key];
        flatRoutes.push(...routes);
      }
    }
    server.route(flatRoutes);

    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true });
    await utils.seed();
    await utils.bull.seedQ();
    console.log("DB connected successfully");
  } catch (e) {
    console.log("DB conn failed", e);
    process.exit(1);
  }

  server.on("response", function (req) {
    console.log(
      `${req.method.toUpperCase()} ${req.path} → ${req.response.statusCode}`
    );
  });
});
