const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllUsers = async ( req , res ) => {
    console.log(req.user);
    // Here we have to remove the password and to do that we have to do -> select('-password')
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users });
}

const getSingleUser = async ( req , res ) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if(!user){
        throw new CustomError.NotFoundError(`Np user with id : ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ user });
}

const showCurrentUser = async ( req , res ) => {
    res.send('get current user');
}

const updateUser = async ( req , res ) => {
    res.send('update User');
}

const updateUserPassword = async ( req , res ) => {
    res.send('password updated');
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}
