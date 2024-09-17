const express = require('express');
const router = express.Router();

const { authenticateUser , authorizePermissions } = require('../middleware/authentication');

const { getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword } = require('../controllers/userControllers');

router.route('/').get(authenticateUser , authorizePermissions('admin','owner') , getAllUsers);

router.route('/showMe').get(authenticateUser,showCurrentUser);
router.route('/updateUser').patch(authenticateUser,updateUser);
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword);

// Here this order will matter because if we take this up them - showMe and other are go to this router
// Because they are treated as params and routes to this.. So always take care of that
router.route('/:id').get(authenticateUser,getSingleUser);

module.exports = router;