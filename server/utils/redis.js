// const { createClient } = require("redis");

// let client;

// async function redis() {
//   if (!client) {
//     client = await createClient({ url: "redis://cache:6379" })
//       .on("error", (err) => {
//         console.log("Redis Client Error", err);
//         process.exit(1);
//       })
//       .connect();
//   }
//   return client;
// }
const Redis = require("ioredis");
let client;
module.exports = () => {
  if (!client) {
    client = new Redis(6379, "cache");
  }
  return client;
};
