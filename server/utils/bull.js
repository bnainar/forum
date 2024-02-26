const Bull = require("bull");
const redis = require("../utils/redis");
const models = require("../models");
const voteQ = new Bull("voteQ", { redis: { port: 6379, host: "cache" } });
// goes through all votes:* keys and updates this potential new count to the Post's vote_count, and deletes the key
voteQ.process(async () => {
  console.log("==> 🐂");
  const cache = await redis();
  const stream = cache.scanStream({
    match: "votes:*",
    count: 100,
  });
  stream.on("data", async (resultKeys) => {
    for (const key of resultKeys) {
      const newCount = await cache.get(key);
      console.log("=> Reading", { key, val: newCount });
      const postId = key.split(":")[1];
      const post = await models.Post.findByPk(postId);
      const oldCount = post.vote_count;
      if (newCount && oldCount != newCount) {
        console.log(
          `==> updating votes of ${postId}: ${oldCount} → ${(post.vote_count =
            newCount)}`
        );
        await post.save();
      }
      await cache.del(key);
    }
  });
  stream.on("end", () => {
    console.log("all keys have been visited");
  });
});
const CRON = "*/20 * * * * *"; // every 20s
const seedQ = () =>
  voteQ.add({ name: "update vote counts" }, { repeat: { cron: CRON } });
module.exports = { voteQ, seedQ };
