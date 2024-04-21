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
  const res = await models.Post.destroy({
    where: { id: req.params.id, authorId: req.auth.credentials.userId },
  });
  if (res) reply();
  else reply().code(404);
};

const editPost = async (req, reply) => {
  const res = await models.Post.update(
    { ...req.payload },
    {
      where: {
        id: req.params.id,
        authorId: req.auth.credentials.userId,
      },
    }
  );
  if (res[0]) reply();
  else reply().code(404);
};

const getPostById = async (req, reply) => {
  const post = await models.Post.findByPk(req.params.id, {
    include: {
      model: models.User,
      as: "author",
      attributes: ["username"],
    },
  });
  if (!post) {
    return reply().code(404);
  }
  const replies = await utils.getFromCache("replies:" + post.id, async () => {
    const res = await models.Reply.count({
      where: {
        parentId: post.id,
      },
    });
    return +res;
  });

  const upvoted = await models.PostVote.findOne({
    where: {
      post_id: post.id,
      user_id: req.auth.credentials.userId,
    },
  });
  const cache = utils.redis();
  const redisVoteCount = await cache.get("votes:" + req.params.id);
  if (!redisVoteCount) {
    console.log(
      `set to redis votes:${req.params.id}=${post.dataValues.vote_count}`
    );
    await cache.set("votes:" + req.params.id, post.dataValues.vote_count);
  }
  reply({
    post,
    votes: redisVoteCount ?? post.dataValues.vote_count,
    replies,
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
