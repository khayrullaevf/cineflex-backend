const User=require("./../models/userModel")
const asyncErrorHandler=require('./../utilis/asyncErrorHandler')
const jwt=require('jsonwebtoken')
const CustomError=require('./../utilis/customError')



const signToken=id=>{
   return jwt.sign({id:id}, process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    });

}


 exports.signup=asyncErrorHandler(async(req,res,next)=>{

        const newUser=await User.create(req.body) 

        const token=signToken(newUser._id)


        res.status(201).json({
            status:"success",
            token:token,
            data:{
                user:newUser
            }
        })
    })  



    exports.login=asyncErrorHandler(async(req,res,next)=>{
        const email=req.body.email
        const password=req.body.password
        //check if email and passowrd is present in request  body
        if(!email||!password){
            const error=new CustomError('Please provide email id and password for login in!',400)
            return next(error)
        }
         

        //Check if user exists with given email
          const user= await User.findOne({email:email}).select('+password')
        //   const isMatch=await user.comparePasswordInDb(password,user.password)

          //if user exits and password is match
          if(!user||!(await user.comparePasswordInDb(password,user.password))){
            const error=new CustomError('Incorrect email or password',400)
            return next(error)
          }
          

          const token=signToken(user._id)
          res.status(200).json({
            status:'success',
            token:token,
        })



    })