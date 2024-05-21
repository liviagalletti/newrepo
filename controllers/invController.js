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
invCont.buildAddClassification = async function (req, res, next) {
  
  let nav = await utilities.getNav()

  res.render("./inventory/add-classification", {
      title: "Add new Classification",
      nav,
      errors: null,
   })

}

/* ****************************************
*  Process add-classification
* ***************************************/
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  console.log("classification_name: ", classification_name)
  console.log("req.body: ", req.body)
  const addResult = await invModel.addClassification(classification_name)
  if (addResult) {
    req.flash("notice", "Classification added successfully.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the classification was not added.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add new Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver add-inventory view
* ***************************************/

invCont.buildAddInventory = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  req.flash("notice", "This is a message.")
  res.render("./inventory/add-inventory", {
      title: "Add new Inventory",
      nav,
      classificationList,
   })
  }

  /* ****************************************
*  Process add-inventory 
* ***************************************/

invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  console.log("req.body: ", req.body)
  const addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  let classificationList = await utilities.buildClassificationList()
  if (addResult) {
    req.flash("notice", "Inventory added successfully.")
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the inventory was not added.")
    res.status(501).render("./inventory/add-inventory", {
      title: "addInventory",
      nav,
      classificationList
    })
  }
}

module.exports = invCont


