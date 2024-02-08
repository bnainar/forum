const redis = require("./redis");

module.exports = async (myKey, missCallback, ms = 60) => {
  const redisClient = await redis();
  try {
    let redisVal = await redisClient.get(myKey);
    if (redisVal) {
      console.log(`cache hit ${myKey}=${redisVal}`);
      return redisVal;
    }
  } catch (e) {
    console.log("Cache hit failed", e);
  }
  try {
    console.log(`cache miss ${myKey}, executing callback`);
    let sqlres = await missCallback();
    console.log({ sqlres });
    await redisClient.set(myKey, sqlres, { EX: ms });
    return sqlres;
  } catch (e) {
    console.log("Cache set failed", e);
  }
};
