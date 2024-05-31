const utilities = require('../utilities/index')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }

  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}
  
/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

   /* ****************************************
*  Deliver account management view
* *************************************** */
async function accountManagement(req, res, next) {
  let nav = await utilities.getNav();
  const { accountData } = res.locals; // Obter dados da conta do middleware checkJWTToken
  const { account_type, account_firstname } = accountData;

  let greeting = `Welcome ${account_firstname}`;

  let inventoryManagementSection = ''; // Inicialmente vazio
  
  if (account_type === 'Employee' || account_type === 'Admin') {
    // Adicionar link para a visualização de gerenciamento de inventário
    inventoryManagementSection = `/inv/`;
  }

  res.render("account/management", {
    title: "Account Management",
    nav,
    message: req.flash("success"),
    errors: req.flash("error"),
    greeting, // Passar a saudação para a visualização
    inventoryManagementSection, // Passar a seção de gerenciamento de inventário para a visualização
  });
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

async function buildUpdateAccount(req, res) {
  try {
    let nav = await utilities.getNav();
    const { accountData } = res.locals; // Obter dados da conta do middleware checkJWTToken
    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      errors: req.flash("error"),
      message: req.flash("success"),
    });
  } catch (error) {
    console.error("Error building update account view:", error);
    req.flash("error", "An error occurred while processing your request.");
    res.redirect("/account/");
  }
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

  if (updateResult) {
    req.flash("success", "Account information updated successfully.");
    // Query account data from the database after update
    const updatedAccountData = await accountModel.getAccountById(account_id);
    res.render("account/management", {
      title: "Account Management",
      nav,
      message: req.flash("success"),
      errors: null,
      accountData: updatedAccountData,
    });
  } else {
    req.flash("error", "Failed to update account information.");
    res.render("account/management", {
      title: "Account Management",
      nav,
      message: req.flash("error"),
      errors: null,
      accountData: null,
    });
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  // Hash the new password
  const hashedPassword = await bcrypt.hash(account_password, 10);

  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("success", "Password updated successfully.");
    // Query account data from the database after update
    const updatedAccountData = await accountModel.getAccountById(account_id);
    res.render("account/management", {
      title: "Account Management",
      nav,
      message: req.flash("success"),
      errors: null,
      accountData: updatedAccountData,
    });
  } else {
    req.flash("error", "Failed to update password.");
    res.render("account/management", {
      title: "Account Management",
      nav,
      message: req.flash("error"),
      errors: null,
      accountData: null,
    });
  }
}

/* ****************************************
 * Comment view
 * ************************************ */
async function buildCommentForm(req, res) {
  let nav = await utilities.getNav();
  res.render("account/comment", {
    title: "Add Comment",
    nav,
    errors: null,
  });
}


/* ****************************************
 * Comment process
 * ************************************ */

async function processComment(req, res) {
  const { comment } = req.body;
  const { user_id, post_id } = req.user; // Supondo que você tenha informações do usuário na requisição

  try {
    const result = await accountModel.addComment(user_id, post_id, comment);
    
    if (result) {
      req.flash("success", "Comment added successfully!");
      res.redirect("/account");
    } else {
      req.flash("error", "Failed to add comment.");
      res.redirect("/account/comment");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    req.flash("error", "An error occurred while adding comment.");
    res.redirect("/account/comment");
  }
}


  module.exports = { buildLogin, 
  buildRegister, registerAccount, 
  accountLogin, accountManagement, 
  accountLogout, buildUpdateAccount,
  updateAccount,updatePassword,
  buildCommentForm, processComment}

  