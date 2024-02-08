const Joi = require("joi");
const controllers = require("../controllers");
module.exports = [
  {
    path: "/reply/{id}",
    method: "GET",
    handler: controllers.reply.getReplyById,
  },

  {
    path: "/reply/{id}",
    method: "PATCH",
    config: {
      handler: controllers.reply.editReply,
      auth: {
        strategy: "cookie-auth",
      },
      validate: {
        payload: Joi.object({
          content: Joi.string().min(4),
        }),
      },
    },
  },
  {
    path: "/reply/{id}",
    method: "DELETE",
    config: {
      handler: controllers.reply.deleteReply,
      auth: {
        strategy: "cookie-auth",
      },
    },
  },
  {
    path: "/reply",
    method: "POST",
    config: {
      handler: controllers.reply.createReply,
      auth: {
        strategy: "cookie-auth",
      },
      validate: {
        payload: Joi.object({
          content: Joi.string().min(4),
          parentId: Joi.number(),
        }),
      },
    },
  },
];
