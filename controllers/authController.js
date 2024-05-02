const User=require("./../models/userModel")
const asyncErrorHandler=require('./../utilis/asyncErrorHandler')
const jwt=require('jsonwebtoken')
const CustomError=require('./../utilis/customError')
const util=require('util')
const crypto=require('crypto')

const sendEmail=require('./../utilis/email')


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

 exports.signup=asyncErrorHandler(async(req,res,next)=>{

        const newUser=await User.create(req.body) 

        createSendResponse(newUser,201,res)
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
          


          createSendResponse(user,200,res)



    })



    exports.protect=asyncErrorHandler(async(req,res,next)=>{
 

      //1.Read the token & check if it exist
      const testToken= req.headers.authorization;
      let token;
      if (testToken&&testToken.startsWith('Bearer')) {
         token= testToken.split(' ')[1]
      }

      if (!token) {
        next(new CustomError('You are not logged in!',401))
      }

      //2. Validate token
       const decodedToken=await util.promisify(jwt.verify)(token,process.env.SECRET_STR)

       console.log(decodedToken);

      //3. if the user exists
      
       const user=await User.findById(decodedToken.id)
       console.log(user);
       if (!user) {
          const error=new CustomError('User with given token does not exist',401)
          next(error)
       }


      //4.if the user changed password after the token was  issued
      const IsPasswordChanged=await user.IsPasswordChanged(decodedToken.iat)
      if (IsPasswordChanged) {
        const err=new CustomError("Password has been changed recently , please login again",401)

        return next(err)
        
      }


       


      //5 . Allow user to access route

      req.user=user
      next()

    })


    exports.restrict=(role)=>{

      return (req,res,next)=>{

        if(req.user.role!=='admin'){
          const err=new CustomError('You do not have  permission to perform this action',403)
          next(err)
        }
        next()


      }

    }



    exports.forgotPassword=asyncErrorHandler(async(req,res,next)=>{
      //1.Get user based on posted email

      const user= await User.findOne({email:req.body.email})
      if (!user) {
        const err=new CustomError('We could not find user with given email!',404)
        next(err)
      }

      //2.generate a random reset token
       const resetToken=user.createResetPasswordToken()

       await user.save({validateBeforeSave:false})

      //3 send etoken back to user email
      const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
      const message=`We have received a password reset request. Please use the below link to reset you password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minuts`

        
      try {
        await sendEmail({
          email:user.email,
          subject:'Password change request received',
          message:message
         })
       

         res.status(200).json({
          status:'success',
          message:"password reset link send to the user email"
         })
        
      } catch (error) {

        user.passwordResetToken=undefined,
        user.passwordResetTokenExpire=undefined
        user.save({validateBeforeSave:false})
    
        return next(new CustomError('There was an error sending passowrd reset email ,Please try again later',500))
      }

      

    })
    
    exports.resetPassword=asyncErrorHandler(async(req,res,next)=>{
     //1.The user exists with given token and token has not expired
      const token=crypto.createHash('sha256').update(req.params.token).digest('hex')
      const user=await User.findOne({passwordResetToken:token,passwordResetTokenExpire:{$gte:Date.now()}});

      if(!user){
        const err=new CustomError('Token is invalid or has expired!',400)
        next(err)
      }

      //Reseting the user password
      user.password=req.body.password;
      user.confirmPassword=req.body.confirmPassword
      user.passwordResetToken=undefined
      user.passwordResetTokenExpire=undefined
      user.passwordChangedAt=Date.now()


      user.save()

      //3.login
      createSendResponse(user,201,res)

    })


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