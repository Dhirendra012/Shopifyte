const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async ( req , res , next ) => {
    const token = req.signedCookies.token;

    if(!token){
        throw new CustomError.UnauthenticatedError('Authentication Inavalid');
    }
    
    try 
    {
        const { name , userId , role } = isTokenValid({token});
        req.user = { name , userId , role };
        next();
    }
    catch (error) 
    {
        throw new CustomError.UnauthenticatedError('Authentication Inavalid');
    }
};

module.exports = {
    authenticateUser,
}