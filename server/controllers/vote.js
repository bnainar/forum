const models = require("../models");
const utils = require("../utils");
const upvote = async (req, reply) => {
  try {
    const res = await models.PostVote.create({
      post_id: req.query.post_id,
      user_id: req.auth.credentials.userId,
    });
    try {
      const redis = await utils.redis();
      const redisVal = await redis.get(req.query.post_id + ":votes");
      if (redisVal) {
        await redis.incr(req.query.post_id + ":votes");
      }
    } catch (e) {
      console.log("redis vote incr fail", e);
    }
    reply(res);
  } catch (error) {
    reply().code(404);
  }
};

module.exports = {
  upvote,
};
