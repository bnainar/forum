const Bull = require("bull");
const redis = require("../utils/redis");
const models = require("../models");
const voteQ = new Bull("voteQ", { redis: { port: 6379, host: "cache" } });
voteQ.process(async () => {
  const cache = await redis();
  const iteratorParams = {
    MATCH: "votes:*",
    COUNT: 10,
  };
  for await (const key of cache.scanIterator(iteratorParams)) {
    const postId = key.split(":")[1];
    const post = await models.Post.findByPk(postId);
    const oldCount = post.vote_count,
      newCount = await cache.get(key);
    if (oldCount != newCount) {
      console.log(
        `updating votes of ${postId}: ${oldCount} -> ${(post.vote_count =
          newCount)}`
      );
      await post.save();
    }
  }
  return;
});
const seedQ = () => voteQ.add({ as: "as" }, { repeat: { cron: "* * * * *" } });

module.exports = { voteQ, seedQ };
