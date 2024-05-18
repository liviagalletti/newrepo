const express = require("express")
const router = new express.Router() 
const invCont = require("../controllers/invController");
const utilities = require('../utilities/index')
const { route } = require("./static");

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);
// Route to build details view
router.get("/detail/:inventoryId", invCont.buildByInventoryId);
// Route to build management view
router.get("/", invCont.buildManagementView);
// Route to build add-classification view / post data 
router.get("/add-classification", invCont.addClassificationView);
router.post(
    "/add-classification",
    utilities.handleErrors(invCont.processAddClassification)
  )

router.get("/add-inventory", invCont.addInventoryView)

module.exports = router;
