const express = require("express")
const router = new express.Router() 
const invCont = require("../controllers/invController");
const utilities = require('../utilities/index')
const validate = require('../utilities/validation');
const { route } = require("./static");

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);
// Route to build details view
router.get("/detail/:inventoryId", invCont.buildByInventoryId);
// Route to build management view
router.get("/", invCont.buildManagementView);
// Route to build add-classification view / post data 
router.get('/add-classification', utilities.checkAccountType(['Employee', 'Admin']), utilities.handleErrors(invCont.buildAddClassification));
router.get('/add-inventory', utilities.checkAccountType(['Employee', 'Admin']), utilities.handleErrors(invCont.buildAddInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))
// Route to build update data view  
router.get("/edit/:inv_id", utilities.checkAccountType(['Employee', 'Admin']), utilities.handleErrors(invCont.editInventoryView))
// Route to build delete data view
router.get("/delete/:inv_id", utilities.checkAccountType(['Employee', 'Admin']), utilities.handleErrors(invCont.deleteInventoryView))

router.post(
    "/deleteConfirm",
    utilities.checkAccountType(['Employee', 'Admin']),
    utilities.handleErrors(invCont.deleteInventory)
)

router.post(
    "/update/", 
    validate.newInventoryRules(),
    validate.checkUpdateData,
    utilities.checkAccountType(['Employee', 'Admin']),
    utilities.handleErrors(invCont.updateInventory)
);

router.post(
    '/add-inventory',
    validate.invRules(),
    validate.invCheck,
    utilities.checkAccountType(['Employee', 'Admin']),
    utilities.handleErrors(invCont.addInventory)
);

router.post(
    '/add-classification',
    validate.regRules(),
    validate.checkData,
    utilities.checkAccountType(['Employee', 'Admin']),
    utilities.handleErrors(invCont.addClassification)
);


module.exports = router;