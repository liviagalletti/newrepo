const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.detailId;
    const vehicle = await invModel.getVehicleById(vehicleId)
    const vehicleHTML = utilities.generateVehicleHTML(vehicle[0]);
    const nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${vehicle[0].inv_make} ${vehicle[0].inv_model} Details`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    console.error("Error getting vehicle details:", error);
    res.status(500).send("Error getting vehicle details");
  }
};

module.exports = invCont;