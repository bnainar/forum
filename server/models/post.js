"use strict";
const { Model } = require("sequelize");
const elastic = require("../utils/elastic");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "authorId",
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
      this.hasMany(models.Reply, {
        foreignKey: {
          name: "parentId",
        },
      });
      this.hasMany(models.PostVote, {
        foreignKey: {
          name: "post_id",
        },
      });
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  Post.afterCreate("create elastic", (post, _) => {
    const el = elastic();
    el.index({
      index: "titleindex",
      id: post.dataValues.id,
      type: "_doc",
      body: { ...post.dataValues, id: undefined },
    });
  });
  Post.afterDestroy("destroy in elastic", (post, _) => {
    const el = elastic();
    el.delete({
      index: "titleindex",
      id: post.dataValues.id,
    });
  });
  Post.afterUpdate("update @elastic", async (post, _) => {
    const el = elastic();
    console.log("update el");

    const docToUpdate = {
      id: post.dataValues.id,
      index: "titleindex",
      type: "_doc",
      body: {
        doc: {
          ...post.dataValues,
        },
      },
    };

    console.log("Document to update is", docToUpdate);

    const res = await el.update(docToUpdate);

    console.log("Update is done", res);
  });
  return Post;
};
