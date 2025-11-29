// controllers/importController.js
const ImportService = require("../services/importService");
const importService = new ImportService();

const importData = async (req, res) => {
  try {
    const { sheetName, data } = req.body;
    if (!sheetName || !data) {
      return res.status(400).json({
        success: false,
        message: "Sheet name and data are required",
      });
    }

    const results = await importService.importData(sheetName, data);

    const successCount = results.filter((r) => r.success).length;
    const errorCount = results.filter((r) => !r.success).length;

    res.json({
      success: true,
      message: `Import terminé: ${successCount} succès, ${errorCount} erreurs`,
      data: results,
      summary: {
        total: results.length,
        success: successCount,
        errors: errorCount,
      },
    });
  } catch (error) {
    console.error("Error in import controller:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  importData,
};
