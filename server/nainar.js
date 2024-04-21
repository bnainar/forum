require("./tracer")("example-hapi-server");

const Hapi = require("hapi");
const api = require("@opentelemetry/api");

const route = require("./routes");
const utils = require("./utils");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      try {
        // Simulate an internal request to the '/about' route
        const aboutResponse = await server.inject("/about");
        const aboutMessage = aboutResponse.result;
        return h(`Hello from homepage! ${aboutMessage}`);
      } catch (err) {
        console.error("Error fetching /about:", err);
        return h("Error fetching /about");
      }
    },
  },
  {
    method: "GET",
    path: "/about",
    handler: (request, h) => {
      return h("This is the about page");
    },
  },
];

const status = function (request, reply) {
  return reply("ok");
};

const user = {
  cache: { expiresIn: 5000 },
  handler: function (request, reply) {
    return reply({ name: "John" });
  },
};

const server = new Hapi.Server();

server.connection({
  host: "0.0.0.0",
  port: 3000,
});

server.register(
  {
    register: require("./plugins/dummy"),
    options: {
      message: "hello",
    },
  },
  (err) => {
    if (err) {
      console.log("Failed loading plugin", err);
    }

    

    server.route({ method: "GET", path: "/status", handler: status });

    server.route({ method: "GET", path: "/user", config: user });
    // server.route(routes)
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

    // console.log(flatRoutes.length);
    server.route(routes);

    server.ext("onRequest", (req, reply) => {
      console.log("onReq");
      const currentSpan = api.trace.getSpan(api.context.active());
      currentSpan.setAttribute("Date", new Date());
      req.traceId = currentSpan.spanContext().traceId;
      reply.continue();
    });
    server.ext("onPreResponse", (req, reply) => {
      console.log(`Jaeger URL: http://localhost:16686/trace/${req?.traceId}`);
      reply.continue();
    });
    server.ext("onPreAuth", (req, reply) => {
      console.log("onPreAuth");
      reply.continue();
    });

    server.start((err) => {
      try {
        if (err) throw err;
        console.log("nainar Server started");
      } catch (e) {
        console.log(" failed", e);
        process.exit(1);
      }
    });
  }
);
