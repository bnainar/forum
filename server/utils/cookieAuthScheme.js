const redis = require("./redis");
const cookieAuthScheme = async (req, reply) => {
  try {
    const cache = await redis();
    console.log(req.state);
    if (!req.state?.session) return reply().code(401);
    const userId = await cache.get(req.state.session);
    if (!userId) return reply().code(401);
    reply.continue({ credentials: { userId } });
  } catch (e) {
    console.log("auth fail", e);
    return reply().code(500);
  }
};
module.exports = cookieAuthScheme;
