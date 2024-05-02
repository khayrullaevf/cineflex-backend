const express=require('express')
const userController=require('./../controllers/userController')
const authController=require('./../controllers/authController')
const router=express.Router()




router.route('/update-password').patch(
    authController.protect, 
    userController.updatePassword
)


module.exports=router