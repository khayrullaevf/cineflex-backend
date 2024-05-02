const User=require("./../models/userModel")
const asyncErrorHandler=require('./../utilis/asyncErrorHandler')
const jwt=require('jsonwebtoken')
const CustomError=require('./../utilis/customError')
const util=require('util')
const crypto=require('crypto')

const sendEmail=require('./../utilis/email')




 exports.getAllUsers=asyncErrorHandler(async(req,res,next)=>{
    const users=await User.find()

    res.status(200).json({
        status:"success",
        result:users.length,
        data:{
            users:users
        }
    })
})







const filterReqObj=(obj, ...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(prop=>{
        if (allowedFields.includes(prop)){
            newObj[prop]=obj[prop]
            
        }

    })
    return newObj
}


const signToken=id=>{
    return jwt.sign({id:id}, process.env.SECRET_STR,{
         expiresIn:process.env.LOGIN_EXPIRES
     });
 
 }

const createSendResponse=(user,statusCode,res)=>{
    const token=signToken(user._id)
  
  
    res.status(statusCode).json({
        status:"success",
        token:token,
        data:{
            user:user
        }
    })
  
  }




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
   createSendResponse(user,200,res)


  })


  exports.updateMe=asyncErrorHandler(async(req,res,next)=>{

//check if request data contain password or confrim password
    if(req.body.password||req.body.confirmPassword){
        return next(new CustomError('You can not update your pasword using this endpoint',400))
    }


    //update user detail

    const filterObj=filterReqObj(req.body,'name','email')
    const updatedUser=await User.findByIdAndUpdate(req.user._id,filterObj,{runValidators:true,new:true})
    res.status(200).json({
        status:"success",
        data:{
            user:updatedUser
        }
    })


  })


  exports.deleteMe=asyncErrorHandler(async(req,res,next)=>{

    await User.findByIdAndUpdate(req.user._id,{active:false})


    res.status(204).json({
        status:"success",
        data:null
    })
  })