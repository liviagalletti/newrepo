const express = require("express")
const router = new express.Router() 
const accountCont  = require('../controllers/accountController')

router.get('/account',accountCont.buildLogin)

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  });
  
module.exports = router;
