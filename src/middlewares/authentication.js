const mongoose=require('mongoose')
module.exports = async (req, res, next) => {
  try{
    next()
  }catch(err){
    next(err)
  }
};
