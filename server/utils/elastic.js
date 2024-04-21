const elastic = require("@elastic/elasticsearch");
let client;

module.exports = () => {
  if (!client) {
    client = new elastic.Client({ node: "http://localhost:9200" });
  }
  return client;
};
