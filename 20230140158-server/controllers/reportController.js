const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { tanggal, nama } = req.query;

    let where = {};

    // Filter tanggal
    if (tanggal) {
      const startDate = `${tanggal} 00:00:00`;
      const endDate = `${tanggal} 23:59:59`;
      where.checkIn = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Filter nama (dari tabel Users)
    let userWhere = {};
    if (nama) {
      userWhere.nama = { [Op.like]: `%${nama}%` };
    }

    const records = await Presensi.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"],
          where: userWhere
        }
      ],
      order: [["checkIn", "ASC"]]
    });

    return res.json({
      message: "Laporan berhasil diambil",
      data: records
    });

  } catch (error) {
    return res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message
    });
  }
};
