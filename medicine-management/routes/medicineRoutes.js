const express = require("express");
const { getAllMedicines, getMedicineById, getMedicineByCategory, updateStock,searchMedicineByName } = require("../controllers/medicineController");
<<<<<<< HEAD
const { authenticateToken } = require("../../user-management/utils/jwt");

const router = express.Router();

router.get("/medicines/pageNumber/:pageNumber/pageSize/:pageSize/category/:category", getAllMedicines);
router.get("/medicines/search", searchMedicineByName);
router.get("/medicines/category/:category", getMedicineByCategory);
router.put("/medicines/update-stock/medicine/:medicineId",authenticateToken, updateStock);
=======

const router = express.Router();

router.get("/medicines/pageNumber/:pageNumber/pageSize/:pageSize", getAllMedicines);
router.get("/medicines/search", searchMedicineByName);
router.get("/medicines/category/:category", getMedicineByCategory);
router.put("/medicines/update-stock/medicine/:medicineId", updateStock);
>>>>>>> 5f13014 (first commit)
router.get("/medicines/:medicineId", getMedicineById);




module.exports = router;
