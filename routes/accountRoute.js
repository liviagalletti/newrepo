const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement))
router.post("/logout", utilities.handleErrors(accountController.accountLogout))
// Atualização das rotas de contas
router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));
router.post("/update", utilities.checkLogin, regValidate.updateAccountRules(), utilities.handleErrors(accountController.updateAccount));

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/comment", utilities.handleErrors(accountController.buildCommentForm));
router.post("/comment", utilities.handleErrors(accountController.processComment));


module.exports = router;