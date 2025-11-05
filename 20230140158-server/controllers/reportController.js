const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { tanggal, nama } = req.query; 
    let options = { where: {} };

  if (tanggal) {
    const startDate = `${tanggal} 00:00:00`;
    const endDate = `${tanggal} 23:59:59`;
    options.where.checkIn = {
    [Op.between]: [startDate, endDate],
  };
}


    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    //  Ambil data dari database
    const records = await Presensi.findAll({
      ...options,
      order: [["checkIn", "ASC"]],
    });

    //  Format tanggal laporan (kalau tidak ada tanggal, tulis "Semua Tanggal")
    const reportDate = tanggal
      ? tanggal.split("-").reverse().join("/")
      : "Semua Tanggal";

    res.json({
      reportDate,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};