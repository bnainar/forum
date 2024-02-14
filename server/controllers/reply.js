const models = require("../models");
const utils = require("../utils");
const createReply = async (req, h) => {
  try {
    console.log({ what: req.payload });
    const res = await models.Reply.create({
      ...req.payload,
      authorId: req.auth.credentials.userId,
    });
    try {
      const redis = await utils.redis();
      const redisVal = await redis.get("replies:" + req.payload.parentId);
      if (redisVal) {
        await redis.incr("replies:" + req.payload.parentId);
      }
    } catch (e) {
      console.log("redis vote incr fail", e);
    }
    return h(res).code(201);
  } catch (error) {
    console.log(error);
    h().code(500);
  }
};

const deleteReply = async (req, reply) => {
  const replyObj = await models.Reply.findByPk(req.params.id);
  if (!replyObj) {
    return reply().code(404);
  }
  if (replyObj.authorId != req.auth.credentials.userId)
    return reply().code(403);
  await replyObj.destroy();
  reply(replyObj);
};

const editReply = async (req, reply) => {
  const replyObj = await models.Reply.findByPk(req.params.id);
  if (!replyObj) {
    return reply().code(404);
  }
  console.log(replyObj.authorId, req.auth.credentials.userId);
  if (replyObj.authorId != req.auth.credentials.userId)
    return reply().code(403);
  console.log("hi from edit");
  replyObj.content = req.payload.content;
  await replyObj.save();
  reply(replyObj);
};

const getReplyById = async (req, reply) => {
  const replyObj = await models.Reply.findByPk(req.params.id);
  if (!replyObj) {
    return reply().code(404);
  }
  reply(replyObj);
};

const getRepliesByPostId = async (req, reply) => {
  const replies = await models.Reply.findAll({
    where: { parentId: req.params.postId },
  });
  reply(replies);
};
module.exports = {
  getReplyById,
  getRepliesByPostId,
  createReply,
  editReply,
  deleteReply,
};
