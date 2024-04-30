const mongoose=require('mongoose')
const validator=require('validator')

const bcrypt=require('bcryptjs')

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










const User=mongoose.model('User',userSchema)


module.exports=User


