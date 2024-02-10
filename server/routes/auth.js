const Joi = require("joi");
const controllers = require("../controllers");
const authRoute = [
  {
    path: "/api/auth/me",
    method: "GET",
    config: {
      handler: async (req, reply) => {
        console.log("req", req.auth.credentials);
        reply(req.auth.credentials).header("Access-Control-Allow-Origin", "*");
      },
      auth: {
        strategy: "cookie-auth",
      },
    },
  },
  {
    path: "/api/login",
    method: "POST",
    config: {
      handler: controllers.auth.login,
      validate: {
        payload: Joi.object({
          username: Joi.string().min(4),
          password: Joi.string().min(8).max(72),
        }),
      },
    },
  },

  {
    path: "/api/signup",
    method: "POST",
    config: {
      handler: controllers.auth.signup,
      validate: {
        payload: Joi.object({
          username: Joi.string().min(4),
          password: Joi.string().min(8).max(72),
        }),
      },
    },
  },

  {
    path: "/api/auth/logout",
    method: "GET",
    config: {
      handler: controllers.auth.logout,
    },
  },
];
module.exports = authRoute;
