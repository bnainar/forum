const models = require("../models");
const { faker } = require("@faker-js/faker");
const seed = async () => {
  await models.User.create({
    username: "mememememem",
    passwordhash: "mememememem",
  });

  for (let i = 1; i < 10; i++) {
    await models.Post.create({
      title: faker.string.alpha(10),
      content: faker.string.alpha(10),
      authorId: 1,
    });
  }
  for (let i = 1; i < 5; i++) {
    await models.Reply.create({
      content: faker.string.alpha(10),
      authorId: 1,
      parentId: 1,
    });
  }
};
module.exports = seed;
