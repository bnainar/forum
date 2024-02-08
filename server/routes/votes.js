const Joi = require("joi");
const controllers = require("../controllers");
module.exports = [
  {
    path: "/vote",
    method: "POST",
    config: {
      handler: controllers.vote.upvote,
      auth: {
        strategy: "cookie-auth",
      },
      validate: {
        query: Joi.object({
          post_id: Joi.number(),
        }),
      },
    },
  },
];
