const models = require("../models");
const utils = require("../utils");
const upvote = async (req, reply) => {
  try {
    const res = await models.PostVote.create({
      post_id: req.query.post_id,
      user_id: req.auth.credentials.userId,
    });
    try {
      const redis = utils.redis();
      const redisVal = await redis.get("votes:" + req.query.post_id);
      if (redisVal) {
        await redis.incr("votes:" + req.query.post_id);
      }
    } catch (e) {
      console.log("redis vote incr fail", e);
    }
    reply(res);
  } catch (error) {
    reply().code(200);
  }
};

module.exports = {
  upvote,
};
