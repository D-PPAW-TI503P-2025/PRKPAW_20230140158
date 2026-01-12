// controllers/iotController.js
const { SensorLog } = require("../models");

// ... (kode saveSensorData dll) ...

exports.getSensorHistory = async (req, res) => {
  try {
    const data = await SensorLog.findAll({
      limit: 20,
      order: [["createdAt", "DESC"]],
    });

    const formattedData = data.reverse();

    res.json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};