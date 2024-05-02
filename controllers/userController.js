const User=require("./../models/userModel")
const asyncErrorHandler=require('./../utilis/asyncErrorHandler')
const jwt=require('jsonwebtoken')
const CustomError=require('./../utilis/customError')
const util=require('util')
const crypto=require('crypto')

const sendEmail=require('./../utilis/email')

const authController=require('./authController')






 exports.updatePassword=asyncErrorHandler(async(req,res,next)=>{

    //get current user data from db

    const user= await User.findById(req.user._id).select('+password');
   
    //check if the supplied current password is correct
    if (!(await user.comparePasswordInDb(req.body.currentPassword,user.password))) {

      return next(new CustomError('Current password you provided is wrong'),401)
      
    }

    //if supplied passowrd is correct, update user password with new value

    user.password=req.body.password
    user.confirmPassword=req.body.confirmPassword
    await user.save()


  //login user and sent jwt

 authController.createSendResponse(user,200,res)


  })