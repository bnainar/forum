const Joi = require("joi");
const controllers = require("../controllers");
module.exports = [
  {
    path: "/posts",
    method: "GET",
    config: {
      handler: controllers.post.getAllPosts,
      validate: {
        query: Joi.object({
          page: Joi.number().default(0),
        }),
      },
    },
  },

  {
    path: "/posts/{id}",
    method: "GET",
    config: {
      handler: controllers.post.getPostById,
      auth: {
        strategy: "cookie-auth",
      },
    },
  },

  {
    path: "/posts/{id}",
    method: "PATCH",
    config: {
      handler: controllers.post.editPost,
      auth: {
        strategy: "cookie-auth",
      },
      validate: {
        payload: Joi.object({
          title: Joi.string().min(4),
          content: Joi.string().min(8).max(72),
        }),
      },
    },
  },
  {
    path: "/posts/{id}",
    method: "DELETE",
    config: {
      handler: controllers.post.deletePost,
      auth: {
        strategy: "cookie-auth",
      },
    },
  },
  {
    path: "/posts",
    method: "POST",
    config: {
      handler: controllers.post.createPost,
      auth: {
        strategy: "cookie-auth",
      },
      validate: {
        payload: Joi.object({
          title: Joi.string().min(4),
          content: Joi.string().min(8).max(72),
        }),
      },
    },
  },
];
