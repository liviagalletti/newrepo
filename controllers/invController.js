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

module.exports = invCont;

