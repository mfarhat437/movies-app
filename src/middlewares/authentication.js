const {authenticate}=require('vpax-auth')
const mongoose=require('mongoose')
module.exports = async (req, res, next) => {
  try{
    const tokenType= req.originalUrl === "/refreshToken" ? 'refreshToken' : 'token'
    const { authorization } = req.headers;
    const user= await authenticate(authorization,tokenType)
    req.user= user
    req.user._id= new mongoose.Types.ObjectId(user._id)
    req.user_id = String(user._id);
    next()
  }catch(err){
    next(err)
  }
};
