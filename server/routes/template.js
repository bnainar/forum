const { User } = require("../models");
const authRoute = [
  {
    path: "/",
    method: "GET",
    handler: (req, h) => h("OK"),
  },

  {
    path: "/users",
    method: "GET",
    handler: (req, h) => User.findAll().then(h),
  },

  {
    path: "/users/{id}",
    method: "GET",
    handler: async (req, reply) => {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return reply().code(404);
      }
      reply(user);
    },
  },

  {
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
  },
  {
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
  },
  {
    path: "/users",
    method: ["PUT", "POST"],
    handler: async (req, h) => h(await User.create(req.payload)).code(201),
  },
];
// module.exports = authRoute;
