const Bull = require("bull");
const redis = require("../utils/redis");
const models = require("../models");
const voteQ = new Bull("voteQ", { redis: { port: 6379, host: "cache" } });
// goes through all votes:* keys and updates this potential new count to the Post's vote_count, and deletes the key
const cache = redis();
voteQ.process(async () => {
  console.log("==> 🐂");
  const stream = cache.scanStream({
    match: "votes:*",
    count: 100,
  });
  stream.on("data", async (resultKeys) => {
    for (const key of resultKeys) {
      const pipeline = await cache.multi().watch(key);
      const newCount = await cache.get(key);
      console.log("=> Reading", { key, val: newCount });
      const postId = key.split(":")[1];
      console.log(`==> 💿 updating votes of post:${postId} to ${newCount}`);
      await models.Post.update(
        { vote_count: newCount },
        { where: { id: postId } }
      );
      await pipeline.del(key).exec();
    }
  });
  stream.on("end", () => {
    console.log("==> 🐂 ❎");
  });
});
const CRON = "*/20 * * * * *"; // every 20s
const seedQ = () =>
  voteQ.add({ name: "update vote counts" }, { repeat: { cron: CRON } });
module.exports = { voteQ, seedQ };
