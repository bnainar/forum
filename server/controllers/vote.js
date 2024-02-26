const models = require("../models");
const utils = require("../utils");
/**
 * If redis does not contain voteCount, set it, then increment it
 */
const upvote = async (req, reply) => {
  try {
    const res = await models.PostVote.create({
      post_id: req.query.post_id,
      user_id: req.auth.credentials.userId,
    });
    const key = "votes:" + req.query.post_id;
    try {
      const redis = utils.redis();
      const redisVal = await redis.get(key);
      if (!redisVal) {
        const post = await models.Post.findByPk(req.query.post_id, {
          attributes: ["vote_count"],
        });
        const vote = post.dataValues.vote_count;
        await redis.set(key, vote);
      }
      await redis.incr(key);
      console.log(key, "in redis");
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
