const redis = require("./redis");

module.exports = async (myKey, missCallback, ms = 60) => {
  const redisClient = redis();
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
    await redisClient.setex(myKey, ms, sqlres);
    return sqlres;
  } catch (e) {
    console.log("Cache set failed", e);
  }
};
