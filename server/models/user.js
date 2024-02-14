"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Post, {
        as: "post",
        foreignKey: {
          name: "authorId",
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
      this.hasMany(models.Reply, {
        foreignKey: { name: "authorId" },
      });
      this.hasMany(models.PostVote, {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      passwordhash: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
