const db = require("./models");
const Hapi = require("hapi");
const route = require("./routes");
// const elastic = require("@elastic/elasticsearch");
// const el = new elastic.Client({ node: "http://elasticsearch:9200" });
const server = new Hapi.Server();
server.connection({
  host: "0.0.0.0",
  port: 3000,
});

server.start(async (err) => {
  if (err) throw err;
  console.log("Server running");
  const flatRoutes = [];
  for (const key in route) {
    if (route[key].length > 0) {
      const routes = route[key];
      flatRoutes.push(...routes);
    }
  }
  server.route(flatRoutes);
  try {
    await db.sequelize.authenticate();
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
