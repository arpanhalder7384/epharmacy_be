const express = require("express");
const { getAllMedicines, getMedicineById, getMedicineByCategory, updateStock,searchMedicineByName } = require("../controllers/medicineController");

const router = express.Router();

router.get("/medicines/pageNumber/:pageNumber/pageSize/:pageSize", getAllMedicines);
router.get("/medicines/search", searchMedicineByName);
router.get("/medicines/category/:category", getMedicineByCategory);
router.put("/medicines/update-stock/medicine/:medicineId", updateStock);
router.get("/medicines/:medicineId", getMedicineById);




module.exports = router;
