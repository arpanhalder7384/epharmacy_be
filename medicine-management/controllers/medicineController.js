const Medicine = require("../models/medicineModel");

// Get all medicines with pagination
exports.getAllMedicines = async (req, res) => {
    console.log("Get ALL Medicine called")
    try {
        const { pageNumber, pageSize, category } = req.params;
        const { sortBy, order } = req.query;

        const page = parseInt(pageNumber) || 1;
        const limit = parseInt(pageSize) || 10;
        let sortQuery = {}; // Default: No Sorting

        // Handling Sorting Logic
        if (sortBy === "name") {
            sortQuery.medicineName = order === "desc" ? -1 : 1;
        } else if (sortBy === "price") {
            sortQuery.price = order === "desc" ? -1 : 1;
        }
        let filter = {}

        if (category !== "all") {
            filter.category = category
        }

        // Fetch medicines from MongoDB with pagination & sorting
        const medicines = await Medicine.find(filter)
            .sort(sortQuery) // Apply Sorting
            .skip((page - 1) * limit) // Apply Pagination
            .limit(limit);

        const count = await Medicine.countDocuments(filter);

        if (medicines.length === 0) {
            return res.status(404).json({ message: "No medicines found" });
        }
        console.log("Success")
        res.status(200).json({ medicines, "total": count });


    } catch (error) {
        console.log("Eroor")

        res.status(400).json({ message: "No medicine found" });
    }
};

// Get medicine by ID
exports.getMedicineById = async (req, res) => {
    try {

        const medicine = await Medicine.findOne({ medicineId: req.params.medicineId });
        if (!medicine) return res.status(400).json({ message: "Medicine not found" });

        res.status(200).json(medicine);
    } catch (error) {
        res.status(400).json({ message: "Invalid medicine IDs", error });
    }
};

// Get medicines by category
exports.getMedicineByCategory = async (req, res) => {
    try {
        const medicines = await Medicine.find({ category: req.params.category });
        res.status(200).json(medicines);
    } catch (error) {
        res.status(400).json({ message: "No medicine found with given category" });
    }
};

// Update medicine stock after order
exports.updateStock = async (req, res) => {
    try {
        const { orderedQuantity } = req.body;
        const medicine = await Medicine.findOne({medicineId:req.params.medicineId});

        if (!medicine || medicine.stockQuantity < orderedQuantity) {
            return res.status(400).json({ message: "Invalid medicine ID or stock not available" });
        }

        if(medicine.availableUnits<orderedQuantity){
            return res.status(400).json({ message: "Invalid ordererQuantity" });
        }

        medicine.availableUnits -= orderedQuantity;
        await medicine.save();

        res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error updating stock" });
    }
};



// Controller: Search Medicine by Name
exports.searchMedicineByName = async (req, res) => {
    try {
        const searchKey = req.query.name;
        if (!searchKey) {
            return res.status(400).json({ message: "Search key is required" });
        }
        const sortQuery = {
            "medicineName": 1
        }
        // Call the service layer
        const medicines = await Medicine.find({
            medicineName: { $regex: `^${searchKey}`, $options: 'i' }
        }).sort(sortQuery);

        if (medicines.length === 0) {
            return res.status(404).json({ message: "No medicines found" });
        }

        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
