const Joi = require("joi");
const controllers = require("../controllers");
module.exports = [
  {
    path: "/api/reply/{id}",
    method: "GET",
    handler: controllers.reply.getReplyById,
  },
  {
    path: "/api/reply/post/{postId}",
    method: "GET",
    handler: controllers.reply.getRepliesByPostId,
  },
  {
    path: "/api/reply/{id}",
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
    path: "/api/reply/{id}",
    method: "DELETE",
    config: {
      handler: controllers.reply.deleteReply,
      auth: {
        strategy: "cookie-auth",
      },
    },
  },
  {
    path: "/api/reply",
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
