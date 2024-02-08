const models = require("../models");
const utils = require("../utils");
const createPost = async (req, h) => {
  try {
    const res = await models.Post.create({
      ...req.payload,
      authorId: req.auth.credentials.userId,
    });
    return h(res).code(201);
  } catch (error) {
    console.log(error);
    h().code(500);
  }
};

const deletePost = async (req, reply) => {
  const post = await models.Post.findByPk(req.params.id);
  if (!post) {
    return reply().code(404);
  }
  if (post.authorId != req.auth.credentials.userId) return reply().code(403);
  await post.destroy();
  reply(post);
};

const editPost = async (req, reply) => {
  const post = await models.Post.findByPk(req.params.id);
  if (!post) {
    return reply().code(404);
  }
  console.log(post.authorId, req.auth.credentials.userId);
  if (post.authorId != req.auth.credentials.userId) return reply().code(403);
  post.title = req.payload.title;
  post.content = req.payload.content;
  await post.save();
  reply(post);
};

const getPostById = async (req, reply) => {
  console.time("getPostTime");
  const post = await models.Post.findByPk(req.params.id);
  if (!post) {
    return reply().code(404);
  }
  const replies = await utils.getFromCache(post.id + ":replies", async () => {
    const res = await models.Reply.findAll({
      where: {
        parentId: post.id,
      },
      attributes: [
        [models.sequelize.fn("COUNT", models.sequelize.col("id")), "replies"],
      ],
    });
    return +res[0].dataValues.replies;
  });

  const votes = await utils.getFromCache(post.id + ":votes", async () => {
    const res = await models.PostVote.findAll({
      where: {
        post_id: post.id,
      },
      attributes: [
        [
          models.sequelize.fn("COUNT", models.sequelize.col("user_id")),
          "votes",
        ],
      ],
    });
    return +res[0].dataValues.votes;
  });
  const upvoted = await models.PostVote.findOne({
    where: {
      post_id: post.id,
      user_id: req.auth.credentials.userId,
    },
  });
  console.timeEnd("getPostTime");

  reply({
    post,
    replies,
    votes,
    upvoted: !!upvoted,
  });
};

const getAllPosts = async (req, reply) => {
  const limit = 10;
  try {
    const res = await models.Post.findAll({
      limit,
      offset: limit * req.query.page,
    });
    reply(res);
  } catch (e) {
    console.log("all posts failed", e);
    reply().code(500);
  }
};
module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  deletePost,
};
