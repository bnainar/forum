require("./tracer")("example-hapi-server");
const api = require('@opentelemetry/api');

const db = require("./models");
const Hapi = require("hapi");
const route = require("./routes");
const utils = require("./utils");
const homeHandler = async (request, h) => {
  try {
    // Simulate an internal request to the '/about' route
    const aboutResponse = await server.inject('/about');
    const aboutMessage = aboutResponse.result;
    return h(`Hello from homepage! ${aboutMessage}`);
  } catch (err) {
    console.error('Error fetching /about:', err);
    return h('Error fetching /about');
  }
};

// Handler for the '/about' route
const aboutHandler = (request, h) => {
  return h('This is the about page');
};
const routes = [
  {
    method: "GET",
    path: "/",
    handler: homeHandler
  },
  {
    method: "GET",
    path: "/about",
    handler: aboutHandler
  },
];

const server = new Hapi.Server();

server.connection({
  host: "0.0.0.0",
  port: 3000,
});
const status = function (request, reply) {

  return reply('ok');
};

server.route({ method: 'GET', path: '/status', handler: status });

// Handler in config

const user = {
  cache: { expiresIn: 5000 },
  handler: function (request, reply) {

      return reply({ name: 'John' });
  }
};

server.route({ method: 'GET', path: '/user', config: user });
server.route(routes)
server.start(async (err) => {
  try {
    if (err) throw err;
    console.log("nainar Server started");
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
    // server.ext("onRequest", (req, reply) => {
    //   console.log("onReq")
    //   const currentSpan = api.trace.getSpan(api.context.active());
    //     currentSpan.setAttribute("Date", new Date());
    //     req.traceId = currentSpan.spanContext().traceId;
    // })
    // server.ext("onPreResponse", (req, reply) => {
    //   console.log(`Jaeger URL: http://localhost:16686/trace/${req?.traceId}`);
    // })
    // server.register({
    //   register: require("./plugins/mylogger"),
    // });
    console.log("before routes register");

    console.log(flatRoutes.length);
    // process.exit(1)
    server.route(flatRoutes);
  } catch (e) {
    console.log(" failed", e);
    process.exit(1);
  }
});
