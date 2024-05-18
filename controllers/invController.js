const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")


const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory Details view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const inventoryData = await invModel.getInventoryById(inventoryId);
  const grid = await utilities.buildInventoryItemGrid(inventoryData);
  const nav = await utilities.getNav();
  const make = inventoryData.inv_make;
  const model = inventoryData.inv_model;
  res.render("./inventory/detail", {
    title: `${make} ${model} Details`,
    nav,
    grid,
  });
};


 /* ****************************************
*  Deliver add management view
* *************************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver add-classification view
* ***************************************/
invCont.addClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
  })
}

/* ****************************************
*  Deliver add-inventory view
* ***************************************/
invCont.addInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
  })
}

/* ****************************************
*  Process Add Classification 
* *************************************** */
invCont.processAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.processAddClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}.`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Registration",
      nav,
    })
  }
}


module.exports = invCont;

