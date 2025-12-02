"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      Presensi.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Presensi.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // kalau kamu punya kolom latitude/longitude, tambahkan di sini:
      // latitude: DataTypes.STRING,
      // longitude: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Presensi",
    }
  );

  return Presensi;
};
