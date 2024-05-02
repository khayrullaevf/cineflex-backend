const mongoose=require('mongoose')
const validator=require('validator')

const bcrypt=require('bcryptjs')
const crypto=require('crypto')

//name,email,password,confirmPassword,photo
const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Please enter your name'],

    },
    
    email:{
        type:String,
        required:[true,'Please enter your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please enter a valid email!']
        
    },
    
    photo:{
        type:String,
        
    },
    
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:8,
        select:false

    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            validator:function(val){
                return val===this.password
            },
           message: "Password did'nt match"
        }
    },

    passwordChangedAt:{
        type:Date
    },

    role:{
        type:String,
        enum:['user','admin'],
        default:"user"
    },
    passwordResetToken:{
        type:String
    },
    passwordResetTokenExpire:{
        type:Date
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    }


})
userSchema.pre('save',  async function(next) {
    if (!this.isModified('password')) return next();
    try {
        // Encrypt the password before saving it (hashing)
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
        next();
    } catch (error) {
        next(error); // Pass any errors to the next middleware
    }
});


userSchema.methods.comparePasswordInDb=async(pswd,pswdDB)=>{
    return await bcrypt.compare(pswd,pswdDB)
}


userSchema.methods.IsPasswordChanged=async function(JWTTimestamp){
    if (this.passwordChangedAt) {
        const passwordChangedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000)
        console.log(passwordChangedTimestamp);
        console.log(this.passwordChangedAt, JWTTimestamp);

       return JWTTimestamp<passwordChangedTimestamp;  //1532672<1748725200
    }
    return false

}
userSchema.methods.createResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex')

    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpire=Date.now()+10*60*1000
   

    console.log(resetToken);
    console.log(this.passwordResetToken);

    return resetToken

}









const User=mongoose.model('User',userSchema)


module.exports=User


