const Joi = require("joi");
const bcrypt = require("bcrypt");
const models = require("../models");
const uuid = require("uuid").v4;
const authRoute = [
  {
    path: "/auth/login",
    method: "POST",
    config: {
      handler: async (req, reply) => {
        const { username, password } = req.payload;
        const user = await models.User.findOne({ where: { username } });
        if (!user) {
          return reply().code(400);
        }
        try {
          const hash = await bcrypt.compare(password, user.passwordhash);
          if (hash) {
            return reply().state("session", uuid());
          } else throw new Error("no match");
        } catch (e) {
          console.log(e);
          reply("wut").code(400);
        }
      },
      validate: {
        payload: Joi.object({
          username: Joi.string().min(4),
          password: Joi.string().min(8).max(72),
        }),
      },
    },
  },

  {
    path: "/auth/signup",
    method: "POST",
    config: {
      handler: async (req, reply) => {
        const { username, password } = req.payload;
        let user = await models.User.findOne({ where: { username } });
        if (user) {
          return reply("Username already exists").code(400);
        }
        const passwordhash = await bcrypt.hash(password, 10);
        user = await models.User.create({
          username,
          passwordhash,
        });
        reply(user);
      },
      validate: {
        payload: Joi.object({
          username: Joi.string().min(4),
          password: Joi.string().min(8).max(72),
        }),
      },
    },
  },

  {
    path: "/auth/logout",
    method: "GET",
    handler: async (req, reply) => reply().state("session", ""),
  },
];
module.exports = authRoute;
