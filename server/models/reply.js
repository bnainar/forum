"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: { name: "authorId" },
      });
      this.belongsTo(models.Post, {
        foreignKey: {
          name: "parentId",
        },
      });
    }
  }
  Reply.init(
    {
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Reply",
    }
  );

  return Reply;
};
