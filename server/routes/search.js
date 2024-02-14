const elastic = require("../utils/elastic");
const Joi = require("joi");
module.exports = [
  {
    path: "/api/search",
    method: "GET",
    config: {
      handler: async (req, reply) => {
        const LIMIT = 2;
        const el = elastic();
        const res = await el.search({
          from: LIMIT * req.query.page,
          size: LIMIT,
          index: "titleindex",
          body: {
            query: {
              multi_match: {
                query: req.query.q,
                fields: ["title", "content"],
              },
            },
          },
        });
        reply(res.body.hits).code(200);
      },
      validate: {
        query: Joi.object({
          q: Joi.string().min(3),
          page: Joi.number().default(0),
        }),
      },
    },
  },
];
