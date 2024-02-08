"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PostVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Post, {
        foreignKey: {
          name: "post_id",
        },
      });
      this.belongsTo(models.User, {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  PostVote.init(
    {
      post_id: { type: DataTypes.INTEGER, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, primaryKey: true },
    },
    {
      sequelize,
      updatedAt: false,
      modelName: "PostVote",
    }
  );
  return PostVote;
};
