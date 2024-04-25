const jwt = require('jsonwebtoken');
const Admin = require('../models/admin')
const { BadRequestError , UnauthenticatedError} = require('../errors')


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };

  const createSendToken = (admin, statusCode, res) => {
    const token = signToken(admin._id);
    const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    res.cookie('jwt', token, cookieOptions);

    //remove password in output
    admin.password=undefined;
    // response sent
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
         admin
        }
      });
  }

// login admin
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new BadRequestError("please provide email and password");
    }
  
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
  
    const isPasswordCorrect = await admin.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    createSendToken(admin, 200, res);
  };
  
  // signup admin
  const signupAdmin = async (req, res) => {
    const admin = await Admin.create({ ...req.body });

    createSendToken(admin, 201, res);
  };

 // protecting routes
const protected = async(req, res, next) => {
let token;
if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
)
{
    token =req.headers.authorization.split(' ')[1];
 
}
if(!token) {
    throw new UnauthenticatedError("you are not logged in! Please login to get access.");
}

let decoded
try {
     decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Handle the decoded token
} catch (error) {
    throw new UnauthenticatedError("Invalid token! Please login again.");
}
// check if admin exists
const currentAdmin = await Admin.findById(decoded.id);
if(!currentAdmin) {

    throw new UnauthenticatedError("The user belonging to this token does no longer exist.")
}
next();
}

module.exports = {
    loginAdmin, 
    signupAdmin,
    protected
}