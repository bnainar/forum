const bcrypt = require("bcrypt");
const models = require("../models");
const utils = require("../utils");
const uuid = require("uuid").v4;
const logger = require("../logger")
const helper = () => {
  logger.warn("have no idea who's the caller, but will get the traceId and spanId")
}
const login = async (req, reply) => {
  try {
    const { username, password } = req.payload;
    logger.info("tryna login")
    helper()
    const user = await models.User.findOne({ where: { username } });
    if (!user) {
      return reply().code(400);
    }
    try {
      const hash = await bcrypt.compare(password, user.passwordhash);
      if (hash) {
        const cache = utils.redis();
        const sessionKey = uuid();
        await cache.setex(sessionKey, 60 * 5, user.id);
        return reply(sessionKey).state("session", sessionKey);
      } else throw new Error("no match");
    } catch (e) {
      console.log("creating session failed", e);
      reply().code(400);
    }
  } catch (e) {
    console.log("login failed", e);
    reply().code(500);
  }
};

const signup = async (req, reply) => {
  try {
    const { username, password } = req.payload;
    let user = await models.User.findOne({ where: { username } });
    if (user) {
      return reply("Username already exists").code(400);
    }
    const passwordhash = await bcrypt.hash(password, 10);
    user = await models.User.create({
      username,
      passwordhash,
    });
    reply(user);
  } catch (e) {
    console.log("signup fail", e);
    reply().code(500);
  }
};

const logout = async (req, reply) => {
  try {
    const cache = await utils.redis();
    await cache.del(req.state.session);
  } catch (e) {
    console.log("logout failed in redis");
  }
  reply().state("session", "");
};

module.exports = {
  login,
  signup,
  logout,
};
