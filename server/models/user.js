"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Post, {
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
