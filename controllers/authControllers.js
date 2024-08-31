const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createJWT } = require('../utils');

const register = async ( req, res ) => {

    // Checking for duplicate email  
    // It can also done by using ( unique: true ) in Schema 
    const { email, name, password } = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if(emailAlreadyExists){
        throw new CustomError.BadRequestError('Email Already Exist');
    }

    // First registered user is an Admin
    const isFirstAccount = ( await User.countDocuments({}) === 0 );
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name , email , password , role });
    const tokenUser = { name: user.name, userId: user._id, role: user.role};
    const token = createJWT({ payload: tokenUser });

    // Cockie Setup
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token',token,{
        httpOnly: true,
        expires: new Date(Date.now() + oneDay)
    });

    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const login = async ( req, res ) => {
    res.send('login user');
};

const logout = async ( req, res ) => {
    res.send('logout user');
};

module.exports = {
    register,
    login,
    logout
}