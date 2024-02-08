const models = require("../models");

const upvote = async (req, reply) => {
  try {
    const res = await models.PostVote.create({
      post_id: req.query.post_id,
      user_id: req.auth.credentials.userId,
    });
    reply(res);
  } catch (error) {
    reply().code(404);
  }
};

module.exports = {
  upvote,
};
