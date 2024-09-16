const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authentication');

const { getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword } = require('../controllers/userControllers');

router.route('/').get(authenticateUser,getAllUsers);
router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

// Here this order will matter because if we take this up them - showMe and other are go to this router
// Because they are treated as params and routes to this.. So always take care of that
router.route('/:id').get(authenticateUser,getSingleUser);

module.exports = router;