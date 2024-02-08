const elastic = require("../utils/elastic");
module.exports = [
  {
    path: "/search/{term}",
    method: "GET",
    handler: async (req, reply) => {
      const el = elastic();
      const res = await el.search({
        index: "titleindex",
        body: {
          query: {
            multi_match: {
              query: req.params.term,
              fields: ["title", "content"],
            },
          },
        },
      });
      reply(res.body.hits).code(200);
    },
  },
];
