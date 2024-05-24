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
  const classificationList  = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationList 
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit", {
    title: "Edit " + itemName,
    nav,
    classificationList : classificationList ,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
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
    })
  }
}


/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete", {
    title: "Delete " + itemName,
    nav,
    classificationList: classificationList ,
    errors: null,
    classification_Id:itemData.classification_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    inv_id: itemData.inv_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    inv_id
  } = req.body
  const deleteResult = await invModel.deleteInventoryItem( 
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    inv_id
  )

  if (deleteResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(inv_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete", {
    title: "Delete " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    inv_id
    })
  }
}


module.exports = invCont


