const express = require('express');
const router = express.Router();



const apiAuthMiddleware = require("../middlewares/api-auth-middleware");
const verifyToken = require("../middlewares/api-token-verifier-middleware");

const customerCustomerController = require("../controllers/customer_controller");





/* POST register customer. */
router.post('/register', apiAuthMiddleware, customerCustomerController.registerCustomer);


/* POST login customer. */
router.post('/login', apiAuthMiddleware, customerCustomerController.loginCustomer);


/* POST update customer. */
router.put('/:customer_id', verifyToken, customerCustomerController.updateCustomer);

/* GET customer by ID. */
router.get('/:customer_id', verifyToken, customerCustomerController.getCustomerById);


/** Update customer password */
router.put("/update/password/:customer_id", apiAuthMiddleware, customerCustomerController.updatePassword);


const customerRepository = require("../repositories/customer_repository");
const passwordResetRouter = require("./password_resets")(customerRepository);
router.use("/forgot-password", passwordResetRouter);

module.exports = router;