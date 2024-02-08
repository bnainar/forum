const redis = require("./redis");

module.exports = async (myKey, missCallback) => {
  const redisClient = await redis();
  try {
    let redisVal = await redisClient.get(myKey);
    if (redisVal) {
      console.log(
        `${myKey} already in redis`,
        (redisVal = JSON.parse(redisVal))
      );
      return redisVal;
    }
  } catch (e) {
    console.log("Cache hit failed", e);
  }
  try {
    console.log(`cache miss ${myKey}, executing callback`);
    let sqlres = await missCallback();
    console.log({ sqlres });
    await redisClient.set(myKey, JSON.stringify(sqlres));
    return sqlres;
  } catch (e) {
    console.log("Cache set failed", e);
  }
};
