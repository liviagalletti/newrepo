const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="vehicle-item">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  
  return grid
}

Util.buildInventoryItemGrid = async function(dataItem) {
  var grid;
  if (dataItem) {
    grid = '<ul id="inv-display">';
    grid += '<li class="vehicle-item">';
    grid += `<a href="../../inv/detail/${dataItem.inv_id}" title="View ${dataItem.inv_make} ${dataItem.inv_model} "><img src="${dataItem.inv_image}" alt="Image of ${dataItem.inv_make} ${dataItem.inv_model} on CSE Motors" /></a>`;
    grid += '<div class="namePrice">';
    grid += '<hr />';
    grid += `<h2><a href="../../inv/detail/${dataItem.inv_id}" title="View ${dataItem.inv_make} ${dataItem.inv_model} details">${dataItem.inv_make} ${dataItem.inv_model}</a></h2>`;
    grid += `<h3>$${dataItem.inv_price}</h3>`;
    grid += '<h3>Color:</h4>';
    grid += `<p>${dataItem.inv_color}</p>`;
    grid += '<h3>Description:</h4>';
    grid += `<p>${dataItem.inv_description}</p>`;
    grid += '<h3>Year:</h4>';
    grid += `<p>${dataItem.inv_year}</p>`;
    grid += '<h3>Mileage:</h4>';
    grid += `<p>${dataItem.inv_miles} miles</p>`;
    grid += '</div>';
    grid += '</li>';
    grid += '</ul>';
  } else {
    grid = '<h2>No vehicles available for this classification.</h2>';
  }
  return grid;
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util